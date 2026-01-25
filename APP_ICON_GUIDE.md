# Setting Up Custom App Icon

## 🎨 Quick Fix for App Icon

Your app currently shows the default Capacitor icon. Here's how to set your custom icon:

### Option 1: Use Existing Icon (Fastest)

You already have `public/pwa-icon-512.png`. Let's use it:

1. **Install the icon generator plugin:**
   ```cmd
   npm install @capacitor/assets --save-dev
   ```

2. **Create the icon source folder:**
   ```cmd
   mkdir resources
   ```

3. **Copy your icon:**
   ```cmd
   copy public\pwa-icon-512.png resources\icon.png
   ```

4. **Generate all icon sizes:**
   ```cmd
   npx capacitor-assets generate --android
   ```

5. **Sync to Android:**
   ```cmd
   npx cap sync
   ```

6. **Rebuild in Android Studio**

### Option 2: Manual Setup (If Option 1 doesn't work)

1. **Prepare your icon:**
   - Must be **1024x1024 PNG**
   - Square shape
   - No transparency for launcher icon

2. **Use Android Asset Studio:**
   - Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - Upload your icon
   - Download the generated zip
   - Extract it

3. **Copy to Android project:**
   - Copy all `mipmap-*` folders to: `android/app/src/main/res/`
   - Replace existing folders

4. **Rebuild the app**

## 📱 Icon Requirements

- **Size:** 1024x1024 pixels (will be scaled down)
- **Format:** PNG
- **Background:** Solid color or your logo
- **Safe area:** Keep important content in center 80%

## ✅ Verify

After rebuilding:
1. Uninstall old app from phone
2. Install new APK
3. Check home screen - you should see your custom icon!

---

**Your current icon location:** `public/pwa-icon-512.png`
