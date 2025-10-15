# iOS App Distribution Guide

## Why Can't iOS Apps Be Downloaded Directly?

Unlike Android, **Apple does not allow direct APK-style downloads** for iOS apps. This is due to Apple's strict security and distribution policies designed to protect users.

## iOS Distribution Options

### 1. **TestFlight** (Beta Testing) ✅ Recommended for Early Access
- **Cost**: Free
- **User Limit**: Up to 10,000 external testers
- **Duration**: 90 days per build
- **Requirements**:
  - Apple Developer Account ($99/year)
  - App uploaded to App Store Connect
  - TestFlight invitation via email or public link

**How to Set Up:**
1. Enroll in Apple Developer Program ($99/year)
2. Archive app in Xcode
3. Upload to App Store Connect
4. Add external testers
5. Share TestFlight link with users

**User Installation:**
1. Install TestFlight app from App Store
2. Open TestFlight invitation link
3. Install the beta app
4. App auto-updates when new builds are released

---

### 2. **App Store** (Official Release) ✅ Best for Public Release
- **Cost**: Apple Developer Account ($99/year)
- **User Limit**: Unlimited
- **Duration**: Permanent (unless removed)
- **Requirements**:
  - Apple Developer Account
  - App Review approval (typically 1-2 days)
  - Compliance with App Store Guidelines

**How to Set Up:**
1. Prepare app for submission
2. Create App Store listing
3. Submit for review
4. Once approved, users can download from App Store

**User Installation:**
1. Open App Store
2. Search for "SmallAviationMonitor"
3. Tap "Get" to install
4. Standard iOS app installation

---

### 3. **Enterprise Distribution** (Organization-Only)
- **Cost**: $299/year (Apple Developer Enterprise Program)
- **User Limit**: Unlimited within organization
- **Requirements**:
  - Must be a legal entity (company/organization)
  - Apps can only be distributed to employees
  - Cannot be used for public distribution

**NOT RECOMMENDED** for public GPS logger app.

---

### 4. **Ad Hoc Distribution** (Limited Testing)
- **Cost**: Included with Developer Account
- **User Limit**: Up to 100 devices
- **Duration**: One year (certificate expires)
- **Requirements**:
  - Device UDIDs must be registered
  - Provisioning profile for each device

**NOT RECOMMENDED** - Too limited for public use.

---

## Recommended Path for SmallAviationMonitor

### Phase 1: TestFlight Beta (Immediate)
1. **Enroll in Apple Developer Program** ($99/year)
2. **Build iOS app** using Xcode
3. **Upload to TestFlight**
4. **Share public TestFlight link** on website
5. **Collect feedback** from beta testers

**Timeline**: 1-2 weeks after enrollment

**User Experience**:
- Install TestFlight (one-time)
- Open invite link
- Install GPS Logger app
- Auto-updates with new builds

---

### Phase 2: App Store Release (After Beta)
1. **Polish app** based on beta feedback
2. **Prepare marketing materials** (screenshots, descriptions)
3. **Submit for App Store Review**
4. **Launch publicly** once approved

**Timeline**: 2-4 weeks after beta testing

**User Experience**:
- Search "SmallAviationMonitor" in App Store
- One-tap install
- Standard App Store experience

---

## Comparison: Android vs iOS

| Feature | Android (APK) | iOS (TestFlight) | iOS (App Store) |
|---------|--------------|------------------|-----------------|
| **Direct Download** | ✅ Yes | ❌ No (needs TestFlight app) | ❌ No (needs App Store) |
| **QR Code Install** | ✅ Yes | ⚠️ Via TestFlight link | ❌ No |
| **Cost** | Free | $99/year | $99/year |
| **User Limit** | Unlimited | 10,000 | Unlimited |
| **Review Process** | None | Optional | Required (1-2 days) |
| **Updates** | Manual | Automatic | Automatic |
| **Security** | User accepts risk | Apple-verified | Apple-verified |

---

## Current Status

### ✅ Android
- **APK Available**: Direct download from GitHub Releases
- **QR Code**: Scan to download on website
- **Installation**: Enable "Unknown Sources" and install

### ⏳ iOS
- **Status**: Code ready, needs Apple Developer enrollment
- **Next Steps**:
  1. Enroll in Apple Developer Program
  2. Set up App Store Connect
  3. Build and upload to TestFlight
  4. Share TestFlight link
  
- **Timeline**: 1-2 weeks after enrollment

---

## Why Not Jailbreak/Sideloading?

### Cydia Impactor / AltStore (Sideloading)
- ⚠️ **Not recommended** - Requires users to have:
  - Apple ID and password
  - Desktop app (Xcode or AltStore)
  - Certificate expires every 7 days (free account)
  - Complex setup process
  - Potential security risks

### Jailbreak Methods
- ❌ **Not viable** - Requires:
  - Device jailbreak (voids warranty)
  - Limited to specific iOS versions
  - Security vulnerabilities
  - Violates Apple ToS

---

## FAQ

### Q: Can I distribute iOS apps without Apple Developer account?
**A:** No. All iOS distribution methods require an Apple Developer account ($99/year).

### Q: Can users install without TestFlight app?
**A:** No. TestFlight is required for beta testing. App Store is required for official releases.

### Q: How long does App Store review take?
**A:** Typically 1-2 days, but can take up to a week for first submission.

### Q: Can I use QR codes for iOS?
**A:** Yes, but the QR code opens TestFlight link, not a direct download.

### Q: What about web apps (PWA)?
**A:** Possible, but limited:
- No background GPS tracking
- No full-screen mode
- Limited native features
- Not recommended for GPS logger

---

## Recommended Setup Steps

### 1. Android (Already Done) ✅
```bash
# Build APK
cd mobile/android
./gradlew assembleRelease

# Upload to GitHub Releases
# Create QR code on website
```

### 2. iOS (Next Steps) ⏳
```bash
# 1. Enroll in Apple Developer Program
https://developer.apple.com/programs/

# 2. Open project in Xcode
cd mobile/ios
open SmallAviationMonitor.xcworkspace

# 3. Configure signing
# - Select your team
# - Update bundle identifier

# 4. Archive build
# Product > Archive

# 5. Distribute to TestFlight
# Window > Organizer > Distribute App
```

---

## Cost Summary

| Item | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Android (Google Play) | $25 | One-time | Optional (direct APK is free) |
| Android (Direct APK) | $0 | - | Via GitHub Releases |
| iOS (TestFlight) | $99 | Annually | Required for beta testing |
| iOS (App Store) | $99 | Annually | Same as TestFlight (included) |
| Domain (optional) | ~$12 | Annually | For custom download URL |

**Total Annual Cost** (both platforms):
- **Minimum**: $0 (Android APK only)
- **With iOS**: $99/year (includes both TestFlight and App Store)
- **With Google Play + iOS**: $124/year ($25 one-time + $99/year)

---

## Resources

### Apple
- **Developer Program**: https://developer.apple.com/programs/
- **TestFlight Guide**: https://developer.apple.com/testflight/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **App Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/

### Community
- **GitHub Issues**: https://github.com/mihrans/SmallAviationMonitor/issues
- **Documentation**: See `mobile/README.md`

---

**Last Updated**: October 15, 2025  
**Status**: Android ✅ Ready | iOS ⏳ Pending Apple Developer enrollment
