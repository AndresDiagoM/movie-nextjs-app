# PWA Enhanced Manifest Setup Guide

## ✅ What's Been Added

### 1. **Shortcuts** (App Shortcuts)
Users can long-press your app icon to access quick actions:
- 🔍 Search
- 🎬 Movies
- 📺 Series
- ▶️ Continue Watching

**How to test:**
- Install the PWA on your phone
- Long-press the app icon
- You should see these shortcuts

### 2. **Screenshots**
Added screenshot entries for app stores (Google Play, Microsoft Store) and PWA installation dialogs.

**Action Required:** Take screenshots of your app and add them to `/public/screenshots/`

#### Screenshot Specifications:
- **Mobile (narrow):** 540x720px or 1080x1440px
- **Desktop (wide):** 1280x720px or 1920x1080px
- **Format:** PNG or JPEG
- **Quality:** High quality, show key features

#### Recommended Screenshots:
1. `home-screenshot.png` - Home screen with movie carousels
2. `player-screenshot.png` - Video player in action
3. `search-screenshot.png` - Search interface
4. `home-desktop.png` - Desktop view

**How to take screenshots:**
```bash
# Create screenshots directory
mkdir -p public/screenshots

# On your phone/browser:
# 1. Open your PWA
# 2. Navigate to each key screen
# 3. Take screenshots
# 4. Resize them to the recommended dimensions
# 5. Save them to public/screenshots/
```

### 3. **Share Target**
Users can now share content TO your app from other apps!

**How it works:**
- User shares a link/text from another app (Twitter, YouTube, etc.)
- Your app appears in the share menu
- The content is sent to `/api/share` API route
- The route processes it and redirects to search or relevant page

**Use cases:**
- Share a movie title from a message → Search in your app
- Share a TMDB link → Open directly in your app
- Share recommendations from social media

**How to test:**
1. Install the PWA on Android (iOS has limited support)
2. Go to any app (Chrome, Twitter, etc.)
3. Share some text or a URL
4. Look for "MovieApp" in the share menu
5. Select it and see where it redirects

## 📱 Creating Better Icons

Your current icons are SVG, which is great, but you should also add PNG versions for better compatibility.

### Recommended Icon Sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

### Quick Icon Generation:

#### Option 1: Use an online tool
- [PWA Asset Generator](https://www.pwabuilder.com/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

#### Option 2: Use ImageMagick (if installed)
```bash
# Install ImageMagick first
# Then convert your logo:
convert your-logo.png -resize 192x192 public/icon-192x192.png
convert your-logo.png -resize 512x512 public/icon-512x512.png
```

#### Option 3: Use online SVG to PNG converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload your icon SVG files
3. Convert to PNG at different sizes
4. Download and add to `/public/`

### Update manifest.json with PNG icons:
Add these to the icons array after generating:
```json
{
  "src": "/icon-192x192.png",
  "sizes": "192x192",
  "type": "image/png",
  "purpose": "any"
},
{
  "src": "/icon-512x512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "any"
},
{
  "src": "/icon-192x192.png",
  "sizes": "192x192",
  "type": "image/png",
  "purpose": "maskable"
}
```

## 🧪 Testing Your Enhanced PWA

### 1. Test Shortcuts
```bash
# Build and run production version
pnpm build
pnpm start

# Or deploy and test on actual device
```

**Android:**
- Long-press app icon → See shortcuts
- Tap a shortcut → Navigate to that page

**Desktop (Chrome/Edge):**
- Right-click app icon in taskbar → See shortcuts

### 2. Test Share Target

**Android Chrome:**
1. Install the PWA
2. Open another app (Twitter, Chrome, etc.)
3. Share some content
4. Look for your app in the share sheet
5. Select it and verify the redirect

### 3. Test Screenshots
Screenshots appear in:
- Chrome's install dialog (desktop)
- Google Play Store (if you publish)
- Microsoft Store (if you publish)

**To see in Chrome:**
1. Open your PWA in Chrome
2. Click the install button
3. Look for screenshots in the install dialog

## 🚀 Additional Enhancements

### Add Display Override
For better control over display modes:
```json
"display_override": ["window-controls-overlay", "standalone", "minimal-ui"]
```

### Add Protocol Handlers
Let your app handle custom URLs:
```json
"protocol_handlers": [
  {
    "protocol": "web+movie",
    "url": "/movies/%s"
  }
]
```

### Add Related Applications
Link to native apps if you have them:
```json
"related_applications": [
  {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=com.example.movieapp",
    "id": "com.example.movieapp"
  }
]
```

## 📊 Analytics

Track PWA-specific metrics:
```typescript
// In your analytics setup
if (window.matchMedia('(display-mode: standalone)').matches) {
  // Track PWA usage
  gtag('event', 'pwa_usage', { source: 'standalone' });
}

// Track shortcut usage
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('source') === 'shortcut') {
  gtag('event', 'shortcut_used', { page: window.location.pathname });
}

// Track share target usage
if (urlParams.get('source') === 'share') {
  gtag('event', 'share_target_used');
}
```

## 🔧 Troubleshooting

### Shortcuts not appearing?
- Uninstall and reinstall the PWA
- Clear cache and service worker
- Check manifest.json is valid (use Chrome DevTools → Application → Manifest)

### Share target not working?
- Only works on Android Chrome (iOS Safari doesn't support it yet)
- Check the share API route is working
- Ensure manifest.json has correct `share_target` configuration

### Screenshots not showing?
- Check file paths are correct
- Ensure files exist in `/public/screenshots/`
- Check image dimensions match specs
- Validate manifest.json

## 📚 Resources

- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Shortcuts API](https://web.dev/app-shortcuts/)
- [Share Target API](https://web.dev/web-share-target/)
