import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, AlertCircle, Globe, Wifi, CheckCircle2, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function MobileDownload() {
  const pwaUrl = `${window.location.origin}/pwa`;
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Smartphone className="h-12 w-12 text-blue-500" />
          <Globe className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2">GPS Logger Web App</h1>
        <p className="text-lg text-muted-foreground">
          Progressive Web App - Works on iOS & Android, no app store required!
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="default" className="bg-blue-600">
            <Wifi className="h-3 w-3 mr-1" /> Works Offline
          </Badge>
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Installable
          </Badge>
          <Badge variant="default" className="bg-purple-600">
            <Smartphone className="h-3 w-3 mr-1" /> Cross-Platform
          </Badge>
        </div>
      </div>

      {/* Main PWA Card */}
      <Card className="border-2 border-blue-500 mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">Progressive Web App</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Recommended
            </Badge>
          </div>
          <CardDescription>
            Install on your phone for an app-like experience with full GPS tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
              <QRCodeSVG
                value={pwaUrl}
                size={240}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground mb-2">
              Scan this QR code with your phone's camera
            </p>
            <p className="text-xs text-center text-muted-foreground">
              {pwaUrl}
            </p>
          </div>

          {/* Launch Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
            onClick={() => window.open('/pwa', '_blank')}
          >
            <Smartphone className="mr-2 h-5 w-5" />
            Launch Web App Now
          </Button>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Platform Support
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>✓ iOS (Safari 11.3+)</li>
                <li>✓ Android (Chrome, Edge)</li>
                <li>✓ Desktop browsers</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Features
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>✓ High-accuracy GPS</li>
                <li>✓ Real-time updates (5s)</li>
                <li>✓ Offline support</li>
                <li>✓ Background sync</li>
              </ul>
            </div>
          </div>

          {/* Installation Instructions */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs">
              <strong className="block mb-2">How to Install:</strong>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-blue-800">📱 iOS (iPhone/iPad):</strong>
                  <ol className="mt-1 space-y-1 list-decimal list-inside ml-2">
                    <li>Open the PWA link in Safari</li>
                    <li>Tap the <strong>Share</strong> button (□ with arrow up)</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap "Add" to confirm</li>
                    <li>Open from your home screen like any other app!</li>
                  </ol>
                </div>
                
                <div>
                  <strong className="text-blue-800">🤖 Android:</strong>
                  <ol className="mt-1 space-y-1 list-decimal list-inside ml-2">
                    <li>Open the PWA link in Chrome</li>
                    <li>Tap the <strong>"Add to Home screen"</strong> banner</li>
                    <li>Or: Tap menu (⋮) → <strong>"Install app"</strong></li>
                    <li>Confirm installation</li>
                    <li>Open from your home screen!</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-300">
                <strong className="text-blue-800">🔐 Grant Location Permission:</strong>
                <p className="mt-1">When you first start tracking, your browser will ask for location permission. Tap "Allow" to enable GPS tracking.</p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Why PWA Section */}
      <Card className="border-2 mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Why Progressive Web App?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm">No App Store Required</strong>
                  <p className="text-xs text-muted-foreground">Install directly from your browser, no Apple ID or Google account needed</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm">Instant Updates</strong>
                  <p className="text-xs text-muted-foreground">Always get the latest version automatically, no manual updates</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm">Cross-Platform</strong>
                  <p className="text-xs text-muted-foreground">Works on iOS, Android, and desktop with the same experience</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm">Full GPS Access</strong>
                  <p className="text-xs text-muted-foreground">Same location accuracy as native apps, updates every 5 seconds</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm">Works Offline</strong>
                  <p className="text-xs text-muted-foreground">Continue tracking without internet, data syncs when reconnected</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-sm">Small Footprint</strong>
                  <p className="text-xs text-muted-foreground">Uses less storage than native apps, uninstall anytime</p>
                </div>
              </div>
            </div>
          </div>

          <Alert className="bg-green-50 border-green-200 mt-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-xs">
              <strong>Perfect for iOS users!</strong> No need to wait for App Store approval or pay $99/year for Apple Developer account. The PWA works great on iPhone and iPad with full GPS access through Safari.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-2 mb-8">
        <CardHeader>
          <CardTitle className="text-xl">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">
                1
              </div>
              <div>
                <strong className="text-sm">Configure Your Device</strong>
                <p className="text-xs text-muted-foreground mt-1">
                  Select your aircraft type (Aircraft, Drone, Paraglider, Hot Air Balloon), enter your name and phone number. Your device ID is automatically generated.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">
                2
              </div>
              <div>
                <strong className="text-sm">Start Tracking</strong>
                <p className="text-xs text-muted-foreground mt-1">
                  Tap "Start Tracking" and grant location permission. The app will continuously monitor your GPS position with high accuracy mode enabled.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">
                3
              </div>
              <div>
                <strong className="text-sm">Automatic Updates</strong>
                <p className="text-xs text-muted-foreground mt-1">
                  Your position is sent to the server every 5 seconds. If you lose connection, data is queued locally and synced when you're back online.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">
                4
              </div>
              <div>
                <strong className="text-sm">View on Dashboard</strong>
                <p className="text-xs text-muted-foreground mt-1">
                  Your live position appears on the monitoring dashboard at{' '}
                  <a href="/" className="text-blue-600 hover:underline">
                    smallaviationmonitor.pages.dev
                  </a>
                  {' '}where administrators can track all active devices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="border-2 mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">GPS Capabilities</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• High-accuracy mode (best available)</li>
                <li>• Update interval: 5 seconds</li>
                <li>• Tracks: Lat, Lng, Altitude, Speed, Heading</li>
                <li>• Accuracy reporting (meters)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Offline Support</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Service Worker caching</li>
                <li>• IndexedDB data queue</li>
                <li>• Automatic background sync</li>
                <li>• No data loss when offline</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Tracking</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Device type and configuration</li>
                <li>• Pilot name and contact info</li>
                <li>• Real-time telemetry data</li>
                <li>• Update statistics and logs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Privacy & Security</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• HTTPS only communication</li>
                <li>• Location permission required</li>
                <li>• Data stored securely on server</li>
                <li>• Uninstall anytime (remove from home screen)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Common Issues</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <strong className="text-foreground">Location permission denied:</strong>
                  <p>iOS: Settings → Safari → Location → "Ask" or "Allow"</p>
                  <p>Android: Settings → Apps → Chrome → Permissions → Location → "Allow"</p>
                </div>
                <div>
                  <strong className="text-foreground">App not installing:</strong>
                  <p>iOS: Must use Safari browser, tap Share → Add to Home Screen</p>
                  <p>Android: Look for "Install app" banner or in Chrome menu</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Documentation</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open('https://github.com/mihrans/SmallAviationMonitor/blob/main/frontend/PWA-README.md', '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PWA Documentation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open('https://github.com/mihrans/SmallAviationMonitor#readme', '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Project README
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open('https://github.com/mihrans/SmallAviationMonitor/issues', '_blank')}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Report an Issue
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>
          Part of SmallAviationMonitor - Tracking aviation worldwide{' '}
          <a
            href="https://github.com/mihrans/SmallAviationMonitor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
