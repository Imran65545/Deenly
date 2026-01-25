# Prayer Settings Modal - Manual Implementation

## Step 1: Find the Header Section

Search for the section in `app/prayer/page.jsx` that has the location display and buttons (around line 530-560).

Look for code that looks like:
```javascript
<div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-emerald-600" />
        ...
    </div>
</div>
```

## Step 2: Add Settings Button

Replace any bell icon button with this settings button:

```javascript
<button
    onClick={() => setShowSettings(true)}
    className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors"
    title="Prayer Settings"
>
    <Settings className="w-5 h-5 text-emerald-600" />
</button>
```

## Step 3: Add Settings Modal

Add this modal component BEFORE the closing `</div>` of the main return statement (near the end of the file, before the last `</div>`):

```javascript
{/* Settings Modal */}
{showSettings && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Prayer Settings</h2>
                <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-6">
                {/* Notification Permission */}
                <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">Prayer Notifications</h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Get notified at each prayer time with Adhan
                            </p>
                            {notificationPermission === 'granted' ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium">
                                        ✓ Enabled
                                    </div>
                                    <button
                                        onClick={toggleNotifications}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        {notificationsEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={async () => {
                                        await requestNotificationPermission();
                                    }}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Allow Notifications
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Adhan Audio Info */}
                <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">Adhan Audio</h3>
                            <p className="text-sm text-slate-600">
                                Adhan will play automatically when notifications appear
                            </p>
                            <div className="mt-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm">
                                🕌 Configured
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors"
            >
                Close
            </button>
        </div>
    </div>
)}
```

## Step 4: Build and Test

```cmd
npm run build
npx cap sync
```

Then rebuild in Android Studio.

## Expected Result

- Settings icon appears instead of bell icon
- Clicking it opens a modal with:
  - "Allow Notifications" button (if not granted)
  - Enable/Disable toggle (if granted)
  - Adhan audio status
- Clean, user-friendly permission flow
