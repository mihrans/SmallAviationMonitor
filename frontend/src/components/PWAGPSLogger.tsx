import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Smartphone, MapPin, Wifi, WifiOff, AlertCircle, CheckCircle2, Download } from 'lucide-react';

const API_URL = 'https://smallaviationmonitor-api.administrator-112.workers.dev/api/v1/gps/position';
const UPDATE_INTERVAL = 5000; // 5 seconds

interface DeviceConfig {
  aircraftType: string;
  name: string;
  phoneNo: string;
  deviceId: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  accuracy: number;
  timestamp: number;
}

export function PWAGPSLogger() {
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWA, setIsPWA] = useState(false);
  const [config, setConfig] = useState<DeviceConfig>({
    aircraftType: '',
    name: '',
    phoneNo: '',
    deviceId: '',
  });
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('Never');
  const [totalUpdates, setTotalUpdates] = useState(0);
  const [pendingUpdates, setPendingUpdates] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const watchIdRef = useRef<number | null>(null);

  // Check if running as PWA
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    setIsPWA(isStandalone);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addError('Connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addError('Connection lost - data will be synced when online');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('pwa-device-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      const deviceId = `pwa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setConfig(prev => ({ ...prev, deviceId }));
    }

    const savedUpdates = localStorage.getItem('pwa-total-updates');
    if (savedUpdates) {
      setTotalUpdates(parseInt(savedUpdates));
    }
  }, []);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setHasPermission(result.state === 'granted');
      
      result.onchange = () => {
        setHasPermission(result.state === 'granted');
      };

      if (result.state === 'prompt') {
        // Trigger permission request
        navigator.geolocation.getCurrentPosition(
          () => setHasPermission(true),
          () => setHasPermission(false),
          { enableHighAccuracy: true }
        );
      }
    } catch (error) {
      console.error('Permission check error:', error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Start tracking
  const startTracking = () => {
    if (!hasPermission) {
      addError('Location permission required');
      requestLocationPermission();
      return;
    }

    if (!config.aircraftType || !config.name || !config.phoneNo) {
      addError('Please fill in all configuration fields');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setCurrentLocation(locationData);
        sendLocationToServer(locationData);
      },
      (error) => {
        addError(`GPS error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    if (isTracking && hasPermission) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => stopTracking();
  }, [isTracking, hasPermission]);

  // Send location to server
  const sendLocationToServer = async (location: LocationData) => {
    const payload = {
      deviceId: config.deviceId,
      deviceType: mapAircraftType(config.aircraftType),
      position: {
        lat: location.latitude,
        lng: location.longitude,
        altitude: location.altitude || 0,
        altitudeUnit: 'meters',
      },
      telemetry: {
        speed: location.speed ? location.speed * 3.6 : 0,
        speedUnit: 'kmh',
        heading: location.heading || 0,
        accuracy: location.accuracy,
      },
      device: {
        name: config.name,
        pilot: config.name,
        contact: config.phoneNo,
      },
      timestamp: new Date(location.timestamp).toISOString(),
      source: 'pwa',
    };

    if (!isOnline) {
      // Save to IndexedDB for later sync
      saveToIndexedDB(payload);
      setPendingUpdates(prev => prev + 1);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setLastUpdateTime(new Date().toLocaleTimeString());
        const newTotal = totalUpdates + 1;
        setTotalUpdates(newTotal);
        localStorage.setItem('pwa-total-updates', newTotal.toString());
        
        // Sync any pending data
        if (pendingUpdates > 0) {
          syncPendingData();
        }
      }
    } catch (error: any) {
      addError(`Failed to send: ${error.message}`);
      saveToIndexedDB(payload);
      setPendingUpdates(prev => prev + 1);
    }
  };

  // Save to IndexedDB for offline support
  const saveToIndexedDB = async (data: any) => {
    try {
      const db = await openDB();
      const tx = db.transaction('pending-gps', 'readwrite');
      await tx.objectStore('pending-gps').add(data);
    } catch (error) {
      console.error('IndexedDB error:', error);
    }
  };

  // Sync pending data when back online
  const syncPendingData = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('pending-gps', 'readonly');
      const store = tx.objectStore('pending-gps');
      const allRecords: any[] = [];
      
      store.openCursor().onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          allRecords.push(cursor.value);
          cursor.continue();
        } else {
          // Send all pending records
          allRecords.forEach(async (record) => {
            try {
              await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record),
              });
              // Delete after successful send
              const deleteTx = db.transaction('pending-gps', 'readwrite');
              deleteTx.objectStore('pending-gps').delete(record.id);
              setPendingUpdates(prev => Math.max(0, prev - 1));
            } catch (error) {
              console.error('Sync error:', error);
            }
          });
        }
      };
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('aviation-gps-db', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pending-gps')) {
          db.createObjectStore('pending-gps', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  const mapAircraftType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'Aircraft': 'aircraft',
      'Drone': 'drone',
      'Paraglider': 'paraglider',
      'Hot Air Balloon': 'balloon',
    };
    return typeMap[type] || 'aircraft';
  };

  const addError = (error: string) => {
    setErrors(prev => [`${new Date().toLocaleTimeString()}: ${error}`, ...prev].slice(0, 5));
  };

  const saveConfig = () => {
    if (!config.aircraftType || !config.name || !config.phoneNo) {
      addError('Please fill in all fields');
      return;
    }
    localStorage.setItem('pwa-device-config', JSON.stringify(config));
    addError('Configuration saved');
  };

  const toggleTracking = () => {
    if (!isTracking) {
      saveConfig();
    }
    setIsTracking(!isTracking);
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          addError('App installed successfully!');
        }
        setInstallPrompt(null);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="container mx-auto max-w-2xl space-y-4">
        {/* Header */}
        <Card className="border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-blue-400" />
                <div>
                  <CardTitle className="text-2xl text-white">PWA GPS Logger</CardTitle>
                  <CardDescription className="text-slate-300">
                    Works on iOS & Android
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Badge variant="default" className="bg-green-600">
                    <Wifi className="h-3 w-3 mr-1" /> Online
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <WifiOff className="h-3 w-3 mr-1" /> Offline
                  </Badge>
                )}
                {isPWA && (
                  <Badge variant="secondary" className="bg-blue-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Installed
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Install Prompt */}
        {!isPWA && installPrompt && (
          <Alert className="border-blue-500 bg-blue-500/10">
            <Download className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Install this app for the best experience!</span>
                <Button size="sm" onClick={handleInstallClick} className="ml-2">
                  Install
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Configuration */}
        <Card className="border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300">Aircraft Type *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Aircraft', 'Drone', 'Paraglider', 'Hot Air Balloon'].map((type) => (
                  <Button
                    key={type}
                    variant={config.aircraftType === type ? 'default' : 'outline'}
                    onClick={() => setConfig({...config, aircraftType: type})}
                    disabled={isTracking}
                    className="h-auto py-3"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-slate-300">Pilot Name *</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                placeholder="Enter your name"
                disabled={isTracking}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={config.phoneNo}
                onChange={(e) => setConfig({...config, phoneNo: e.target.value})}
                placeholder="+1234567890"
                disabled={isTracking}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <p className="text-xs text-slate-400">
              Device ID: {config.deviceId || 'Not generated'}
            </p>

            {!isTracking && (
              <Button onClick={saveConfig} className="w-full">
                Save Configuration
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Tracking Control */}
        <Card className="border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">GPS Tracking</CardTitle>
              <Button
                onClick={toggleTracking}
                variant={isTracking ? 'destructive' : 'default'}
                size="lg"
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasPermission && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Location permission required. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto ml-1"
                    onClick={requestLocationPermission}
                  >
                    Grant permission
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {isTracking && currentLocation && (
              <div className="space-y-2 bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <MapPin className="h-4 w-4 animate-pulse" />
                  <span className="font-semibold">Live Position</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400">Latitude:</span>
                    <p className="text-white font-mono">{currentLocation.latitude.toFixed(6)}°</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Longitude:</span>
                    <p className="text-white font-mono">{currentLocation.longitude.toFixed(6)}°</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Altitude:</span>
                    <p className="text-white font-mono">
                      {currentLocation.altitude?.toFixed(1) || 'N/A'} m
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Speed:</span>
                    <p className="text-white font-mono">
                      {currentLocation.speed ? (currentLocation.speed * 3.6).toFixed(1) : 'N/A'} km/h
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Accuracy:</span>
                    <p className="text-white font-mono">{currentLocation.accuracy.toFixed(1)} m</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Heading:</span>
                    <p className="text-white font-mono">
                      {currentLocation.heading?.toFixed(0) || 'N/A'}°
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">{totalUpdates}</p>
                <p className="text-xs text-slate-400">Updates Sent</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-yellow-400">{pendingUpdates}</p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-xs text-slate-400">Last Update</p>
                <p className="text-sm font-mono text-white">{lastUpdateTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Errors */}
        {errors.length > 0 && (
          <Card className="border-red-500/20 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs font-mono text-slate-300">
                {errors.map((error, index) => (
                  <div key={index} className="truncate">{error}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-xs text-slate-400 space-y-1">
              <p>✓ Works offline - data syncs when online</p>
              <p>✓ Background GPS tracking</p>
              <p>✓ Add to home screen for app-like experience</p>
              <p>✓ Updates every 5 seconds</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
