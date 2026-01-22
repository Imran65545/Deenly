import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/models/PushSubscription';
import { sendPushNotification } from '@/lib/webpush';

export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint required' },
                { status: 400 }
            );
        }

        // Find the subscription
        const subscription = await PushSubscription.findOne({ endpoint });

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
            playAudio: subscription.adhanAudioEnabled,
            prayer: 'Test',
            time: new Date().toLocaleTimeString()
        };

        const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: subscription.keys
        };

        const result = await sendPushNotification(pushSubscription, payload);

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
