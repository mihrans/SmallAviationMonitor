import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Apple, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GITHUB_REPO = 'mihrans/SmallAviationMonitor';
const APK_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/releases/latest/download/app-release.apk`;
const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;

export function MobileDownload() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Download GPS Logger</h1>
        <p className="text-lg text-muted-foreground">
          Mobile app for tracking your flights and sending GPS data to SmallAviationMonitor
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Android Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="h-8 w-8 text-green-600" />
              <CardTitle className="text-2xl">Android</CardTitle>
            </div>
            <CardDescription>
              Download the APK directly to your Android device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg inline-block mx-auto flex justify-center">
              <QRCodeSVG
                value={APK_DOWNLOAD_URL}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Scan this QR code with your Android device
            </p>

            {/* Download Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={() => window.open(APK_DOWNLOAD_URL, '_blank')}
            >
              <Download className="mr-2 h-5 w-5" />
              Download APK
            </Button>

            {/* Installation Instructions */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Installation:</strong>
                <ol className="mt-2 space-y-1 list-decimal list-inside">
                  <li>Enable "Install from Unknown Sources" in Settings</li>
                  <li>Download and open the APK file</li>
                  <li>Follow the installation prompts</li>
                  <li>Grant location permissions when prompted</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="pt-2">
              <p className="text-sm font-semibold mb-1">Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ High-accuracy GPS tracking</li>
                <li>✓ Real-time position updates</li>
                <li>✓ Multiple aircraft types</li>
                <li>✓ Offline configuration storage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* iOS Card */}
        <Card className="border-2 border-muted">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Apple className="h-8 w-8 text-gray-600" />
              <CardTitle className="text-2xl">iOS</CardTitle>
            </div>
            <CardDescription>
              Coming soon via TestFlight or App Store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Placeholder */}
            <div className="bg-muted p-4 rounded-lg h-[200px] flex items-center justify-center">
              <div className="text-center">
                <Apple className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  iOS build coming soon
                </p>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              iOS requires App Store or TestFlight distribution
            </p>

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Why no direct download?</strong>
                <p className="mt-2">
                  Apple's security policies prevent direct app installation. iOS apps must be
                  distributed through:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li><strong>TestFlight</strong> - Beta testing (up to 10,000 users)</li>
                  <li><strong>App Store</strong> - Official release</li>
                  <li><strong>Enterprise</strong> - Organization-only (requires license)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="pt-2">
              <p className="text-sm font-semibold mb-1">Coming Soon:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>□ TestFlight beta program</li>
                <li>□ App Store submission</li>
                <li>□ Same features as Android</li>
                <li>□ iOS-optimized interface</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">Android:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Android 6.0 (API 23) or higher</li>
                <li>• GPS/Location services</li>
                <li>• Internet connection</li>
                <li>• ~15 MB storage space</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">iOS (when available):</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• iOS 13.0 or higher</li>
                <li>• GPS/Location services</li>
                <li>• Internet connection</li>
                <li>• ~20 MB storage space</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">Documentation:</p>
              <ul className="space-y-1">
                <li>
                  <a
                    href={`https://github.com/${GITHUB_REPO}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    → User Guide
                  </a>
                </li>
                <li>
                  <a
                    href={`https://github.com/${GITHUB_REPO}/blob/main/mobile/README.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    → Mobile App Docs
                  </a>
                </li>
                <li>
                  <a
                    href={`https://github.com/${GITHUB_REPO}/blob/main/mobile/QUICK-SETUP.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    → Quick Setup
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Support:</p>
              <ul className="space-y-1">
                <li>
                  <a
                    href={`https://github.com/${GITHUB_REPO}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    → Report an Issue
                  </a>
                </li>
                <li>
                  <a
                    href={GITHUB_RELEASES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    → All Releases
                  </a>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Version Info */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Latest version: <strong>v1.0.0</strong> • Updated: October 15, 2025
        </p>
        <p className="mt-1">
          Open source •{' '}
          <a
            href={`https://github.com/${GITHUB_REPO}`}
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
