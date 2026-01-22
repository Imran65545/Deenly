import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/models/PushSubscription';
import { sendPushNotification } from '@/lib/webpush';
import admin from '@/lib/firebase-admin';

export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { endpoint, token } = body;

        // Support both endpoint (legacy/VAPID) and token (FCM)
        const identifier = token || endpoint;

        if (!identifier) {
            return NextResponse.json(
                { error: 'Endpoint or token required' },
                { status: 400 }
            );
        }

        // Find the subscription by either FCM token or VAPID endpoint
        const subscription = await PushSubscription.findOne({
            $or: [
                { fcmToken: identifier },
                { endpoint: identifier }
            ]
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        // Send test notification
        const payload = {
            title: 'Test Prayer Notification',
            body: "This is a test notification from Deenly",
            icon: '/icon.png',
            badge: '/icon.png',
            data: {
                url: '/prayer',
                playAudio: subscription.adhanAudioEnabled ? 'true' : 'false',
                prayer: 'Test',
                time: new Date().toLocaleTimeString()
            }
        };

        let result = { success: false };

        if (subscription.tokenType === 'fcm' || subscription.fcmToken === identifier) {
            // Send via Firebase Admin
            try {
                await admin.messaging().send({
                    token: subscription.fcmToken,
                    notification: {
                        title: payload.title,
                        body: payload.body
                    },
                    webpush: {
                        notification: {
                            icon: payload.icon,
                            badge: payload.badge,
                            data: payload.data
                        },
                        fcmOptions: {
                            link: '/prayer'
                        }
                    },
                    data: payload.data
                });
                result.success = true;
            } catch (error) {
                console.error('FCM Test Error:', error);
                return NextResponse.json(
                    { error: 'Failed to send FCM notification', details: error.message },
                    { status: 500 }
                );
            }
        } else {
            // Legacy VAPID
            const pushSubscription = {
                endpoint: subscription.endpoint,
                keys: subscription.keys
            };

            // Legacy payload format for sw.js
            const vapidPayload = {
                title: payload.title,
                body: payload.body,
                icon: payload.icon,
                badge: payload.badge,
                playAudio: subscription.adhanAudioEnabled,
                prayer: 'Test',
                time: payload.data.time
            };

            result = await sendPushNotification(pushSubscription, vapidPayload);
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Test notification sent successfully'
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to send notification', details: result.error },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error sending test notification:', error);
        return NextResponse.json(
            { error: 'Failed to send test notification' },
            { status: 500 }
        );
    }
}
