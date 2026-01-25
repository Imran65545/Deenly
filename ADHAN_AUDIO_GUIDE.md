# Adding Adhan Audio to Your App

## 📢 What You Need

You need an **Adhan audio file** (MP3 format) to play when prayer notifications appear.

## 🎵 Step 1: Get an Adhan Audio File

### Option A: Download from a free source
1. Go to: https://www.zedge.net/find/ringtones/adhan
2. Or search "Adhan ringtone MP3" on Google
3. Download your preferred Adhan (recommended: **Makkah Adhan** or **Madinah Adhan**)
4. Make sure it's in **MP3 format**

### Option B: Use a YouTube converter
1. Find an Adhan on YouTube (search "Makkah Adhan")
2. Use a YouTube to MP3 converter
3. Download the MP3 file

## 📁 Step 2: Add the Audio to Your Android Project

1. **Rename the file** to `adhan.mp3` (lowercase, no spaces)

2. **Copy it to the Android resources folder:**
   ```
   android/app/src/main/res/raw/
   ```
   
   If the `raw` folder doesn't exist, create it:
   ```cmd
   mkdir android\app\src\main\res\raw
   ```

3. **Place the file:**
   ```cmd
   copy path\to\your\adhan.mp3 android\app\src\main\res\raw\adhan.mp3
   ```

## 🔧 Step 3: Configure Notification Channel (Already Done)

The code has been updated to use `adhan.mp3` as the notification sound.

## 🎯 Step 4: Rebuild the App

After adding the audio file:

```cmd
cd android
gradlew assembleDebug
```

Or rebuild in Android Studio.

## ✅ Testing

1. Install the new APK on your phone
2. Enable notifications in the app
3. Close the app completely
4. Wait for the next prayer time
5. You should hear the **Adhan playing** when the notification appears! 🕌

## 🎚️ Volume Control

The Adhan will play at the **notification volume** of your phone. Users can control it via:
- Phone's notification volume slider
- Or in the app's notification settings (long-press the notification)

## 📝 Important Notes

- **File size:** Keep the Adhan file under 1MB for best performance
- **Format:** Must be MP3 (Android supports MP3, OGG, WAV)
- **Duration:** Recommended 30-60 seconds (full Adhan is fine too)
- **Quality:** 128kbps is sufficient for good quality

## 🔄 Changing the Adhan

To use a different Adhan:
1. Replace `android/app/src/main/res/raw/adhan.mp3` with your new file
2. Keep the same filename (`adhan.mp3`)
3. Rebuild the app

---

**Need help finding a good Adhan?** Popular choices:
- Makkah Adhan (Sheikh Ali Ahmed Mulla)
- Madinah Adhan (Sheikh Ali Ahmed Mulla)
- Egyptian Adhan (Sheikh Mahmoud Khalil Al-Hussary)
