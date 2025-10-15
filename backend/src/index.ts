/**
 * SmallAviationMonitor API Worker
 * Main entry point for Cloudflare Workers API
 */

export interface Env {
	DB: D1Database;
	// ALERT_QUEUE: Queue; // Requires paid plan
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// CORS headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// API Routes
			if (path.startsWith('/api/v1')) {
				return handleAPIRequest(request, env, path, corsHeaders);
			}

			// Health check
			if (path === '/health') {
				return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, corsHeaders);
			}

			// Root endpoint
			if (path === '/') {
				return jsonResponse({
					name: 'SmallAviationMonitor API',
					version: '1.0.0',
					endpoints: {
						health: '/health',
						gps: '/api/v1/gps/*',
						reservations: '/api/v1/reservations/*',
						devices: '/api/v1/devices/*',
					},
				}, corsHeaders);
			}

			return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
		} catch (error) {
			console.error('Error:', error);
			return jsonResponse(
				{ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
				corsHeaders,
				500
			);
		}
	},
};

async function handleAPIRequest(
	request: Request,
	env: Env,
	path: string,
	corsHeaders: Record<string, string>
): Promise<Response> {
	const method = request.method;

	// GPS endpoints
	if (path.startsWith('/api/v1/gps')) {
		if (path === '/api/v1/gps/position' && method === 'POST') {
			return handleGPSPosition(request, env, corsHeaders);
		}
		if (path === '/api/v1/gps/batch' && method === 'POST') {
			return handleGPSBatch(request, env, corsHeaders);
		}
	}

	// Devices endpoints
	if (path.startsWith('/api/v1/devices')) {
		if (path === '/api/v1/devices' && method === 'GET') {
			return handleGetDevices(request, env, corsHeaders);
		}
		if (path.match(/^\/api\/v1\/devices\/[^/]+$/) && method === 'GET') {
			const deviceId = path.split('/').pop()!;
			return handleGetDevice(deviceId, env, corsHeaders);
		}
	}

	// Reservations endpoints
	if (path.startsWith('/api/v1/reservations')) {
		if (path === '/api/v1/reservations' && method === 'POST') {
			return handleCreateReservation(request, env, corsHeaders);
		}
		if (path === '/api/v1/reservations' && method === 'GET') {
			return handleGetReservations(request, env, corsHeaders);
		}
		if (path === '/api/v1/reservations/active' && method === 'GET') {
			return handleGetActiveReservations(request, env, corsHeaders);
		}
	}

	return jsonResponse({ error: 'Endpoint not found' }, corsHeaders, 404);
}

// GPS Position Handler
async function handleGPSPosition(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const data = await request.json() as any;

		// Validate required fields
		if (!data.deviceId || !data.position || !data.position.lat || !data.position.lng) {
			return jsonResponse({ error: 'Missing required fields' }, corsHeaders, 400);
		}

		// Validate coordinates
		if (data.position.lat < -90 || data.position.lat > 90) {
			return jsonResponse({ error: 'Invalid latitude' }, corsHeaders, 400);
		}
		if (data.position.lng < -180 || data.position.lng > 180) {
			return jsonResponse({ error: 'Invalid longitude' }, corsHeaders, 400);
		}

		// Check if device exists, if not create it
		const deviceCheck = await env.DB.prepare(
			'SELECT id FROM devices WHERE id = ?'
		).bind(data.deviceId).first();

		if (!deviceCheck) {
			// Create device
			await env.DB.prepare(
				'INSERT INTO devices (id, name, type, pilot, status, api_key) VALUES (?, ?, ?, ?, ?, ?)'
			).bind(
				data.deviceId,
				data.device?.name || data.deviceId,
				data.deviceType || 'aircraft',
				data.device?.pilot || 'Unknown',
				'online',
				'temp-key-' + Math.random().toString(36)
			).run();
		} else {
			// Update device status
			await env.DB.prepare(
				'UPDATE devices SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?'
			).bind('online', data.deviceId).run();
		}

		// Insert position
		await env.DB.prepare(
			`INSERT INTO positions (device_id, lat, lng, altitude, altitude_unit, speed, speed_unit, heading, vertical_speed, timestamp)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		).bind(
			data.deviceId,
			data.position.lat,
			data.position.lng,
			data.position.altitude || 0,
			data.position.altitudeUnit || 'meters',
			data.telemetry?.speed || 0,
			data.telemetry?.speedUnit || 'kmh',
			data.telemetry?.heading || 0,
			data.telemetry?.verticalSpeed || 0,
			data.timestamp || new Date().toISOString()
		).run();

		return jsonResponse({
			success: true,
			deviceId: data.deviceId,
			receivedAt: new Date().toISOString(),
			message: 'Position data received',
		}, corsHeaders);
	} catch (error) {
		console.error('Error handling GPS position:', error);
		return jsonResponse({
			error: 'Failed to process position data',
			message: error instanceof Error ? error.message : 'Unknown error',
		}, corsHeaders, 500);
	}
}

// GPS Batch Handler
async function handleGPSBatch(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const data = await request.json() as any;
		const positions = data.positions || [];

		if (!Array.isArray(positions) || positions.length === 0) {
			return jsonResponse({ error: 'No positions provided' }, corsHeaders, 400);
		}

		const results = [];
		for (const position of positions) {
			// Process each position (simplified for now)
			results.push({ deviceId: position.deviceId, success: true });
		}

		return jsonResponse({
			success: true,
			processed: results.length,
			results,
		}, corsHeaders);
	} catch (error) {
		return jsonResponse({ error: 'Failed to process batch' }, corsHeaders, 500);
	}
}

// Get Devices Handler
async function handleGetDevices(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(
			`SELECT id, name, type, pilot, status, battery, last_seen, created_at
			 FROM devices
			 ORDER BY last_seen DESC
			 LIMIT 100`
		).all();

		return jsonResponse({
			success: true,
			devices: results,
			count: results.length,
		}, corsHeaders);
	} catch (error) {
		return jsonResponse({ error: 'Failed to fetch devices' }, corsHeaders, 500);
	}
}

// Get Single Device Handler
async function handleGetDevice(deviceId: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const device = await env.DB.prepare(
			'SELECT * FROM devices WHERE id = ?'
		).bind(deviceId).first();

		if (!device) {
			return jsonResponse({ error: 'Device not found' }, corsHeaders, 404);
		}

		// Get latest position
		const position = await env.DB.prepare(
			'SELECT * FROM positions WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1'
		).bind(deviceId).first();

		return jsonResponse({
			success: true,
			device,
			latestPosition: position,
		}, corsHeaders);
	} catch (error) {
		return jsonResponse({ error: 'Failed to fetch device' }, corsHeaders, 500);
	}
}

// Create Reservation Handler
async function handleCreateReservation(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const data = await request.json() as any;

		// Validate required fields
		if (!data.deviceId || !data.airspace || !data.timing) {
			return jsonResponse({ error: 'Missing required fields' }, corsHeaders, 400);
		}

		const reservationId = 'res_' + crypto.randomUUID();

		await env.DB.prepare(
			`INSERT INTO reservations (id, device_id, pilot, pilot_email, polygon, min_altitude, max_altitude, altitude_unit, start_time, end_time, purpose, status)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		).bind(
			reservationId,
			data.deviceId,
			data.pilot?.name || 'Unknown',
			data.pilot?.contact || '',
			JSON.stringify(data.airspace.polygon),
			data.airspace.minAltitude,
			data.airspace.maxAltitude,
			data.airspace.altitudeUnit || 'feet',
			data.timing.startTime,
			data.timing.endTime,
			data.purpose || '',
			'pending'
		).run();

		return jsonResponse({
			success: true,
			reservationId,
			status: 'pending',
			message: 'Reservation created successfully',
		}, corsHeaders, 201);
	} catch (error) {
		return jsonResponse({ error: 'Failed to create reservation' }, corsHeaders, 500);
	}
}

// Get Reservations Handler
async function handleGetReservations(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(
			`SELECT * FROM reservations ORDER BY start_time DESC LIMIT 50`
		).all();

		return jsonResponse({
			success: true,
			reservations: results,
			count: results.length,
		}, corsHeaders);
	} catch (error) {
		return jsonResponse({ error: 'Failed to fetch reservations' }, corsHeaders, 500);
	}
}

// Get Active Reservations Handler
async function handleGetActiveReservations(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const now = new Date().toISOString();
		const { results } = await env.DB.prepare(
			`SELECT * FROM reservations
			 WHERE status IN ('approved', 'active')
			 AND start_time <= ?
			 AND end_time >= ?
			 ORDER BY start_time`
		).bind(now, now).all();

		return jsonResponse({
			success: true,
			reservations: results,
			count: results.length,
		}, corsHeaders);
	} catch (error) {
		return jsonResponse({ error: 'Failed to fetch active reservations' }, corsHeaders, 500);
	}
}

// Utility function to create JSON responses
function jsonResponse(data: any, headers: Record<string, string>, status: number = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	});
}
