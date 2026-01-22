import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/models/PushSubscription';

export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { subscription, location, notificationsEnabled, adhanAudioEnabled } = body;
        let { subscription, location, notificationsEnabled, adhanAudioEnabled } = body;

        console.log('Request body:', body);
        console.log('Subscription:', subscription);
        console.log('Location:', location);
        console.log('Notifications Enabled:', notificationsEnabled);
        console.log('Adhan Audio Enabled:', adhanAudioEnabled);

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json(
                { error: 'Invalid subscription' },
                { status: 400 }
            );
        }

        // Basic data validation
        if (typeof notificationsEnabled !== 'boolean' || typeof adhanAudioEnabled !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid data types for notificationsEnabled or adhanAudioEnabled' },
                { status: 400 }
            );
        }
        
        if (!location || typeof location !== 'object') {
           location = {}; // Ensure location is at least an empty object to prevent schema errors
        }

        // Check if subscription already exists
        const existing = await PushSubscription.findOne({ endpoint: subscription.endpoint });

        if (existing) {
            // Update existing subscription
            existing.keys = subscription.keys;
            existing.location = location;
            existing.notificationsEnabled = notificationsEnabled;
            existing.notificationsEnabled = notificationsEnabled; 
            existing.adhanAudioEnabled = adhanAudioEnabled;

            // Basic validation before saving - mongoose also does validation
            try {
              await existing.validate(); // Trigger mongoose validation
            } catch (validationError) {
              console.error('Mongoose validation error:', validationError);
              return NextResponse.json({ error: 'Mongoose validation failed', details: validationError.message }, { status: 400 });
            }
            await existing.save();

            return NextResponse.json({
                success: true,
                message: 'Subscription updated',
                subscription: existing
            });
        }

        // Create new subscription
        const newSubscription = await PushSubscription.create({
         // Ensure all required fields are present before creating the subscription
         try {
          if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
            return NextResponse.json({ error: 'Missing keys in subscription' }, { status: 400 });
          }

            const newSubscription = new PushSubscription({

        } catch (e) {
                console.error("Subscription creation error:", e);

            endpoint: subscription.endpoint,
            keys: subscription.keys,
            location,
            notificationsEnabled,
            adhanAudioEnabled
        });


         try {
           await newSubscription.save();
           return NextResponse.json({
             success: true,
             message: 'Subscription created',
             subscription: newSubscription
           });
         } catch (saveError) {
           console.error('Error during subscription save:', saveError);
           return NextResponse.json({ error: 'Subscription save failed', details: saveError.message }, { status: 500 });
         }

        return NextResponse.json({
            success: true,
            message: 'Subscription created',
            subscription: newSubscription

        });

    } catch (error) {
        console.error('Error saving push subscription:', error);
        return NextResponse.json(
            { error: 'Failed to save subscription' },
            { status: 500 }
        );
    }
}
