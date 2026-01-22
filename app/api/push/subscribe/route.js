import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/models/PushSubscription';

export async function POST(request) {
  console.log('DEBUG: Subscribe API called');
  try {
    await dbConnect();

    const body = await request.json();
    console.log('DEBUG: Subscribe Body:', JSON.stringify(body, null, 2));

    let { subscription, token, location, notificationsEnabled, adhanAudioEnabled } = body;

    // Determine if this is FCM or VAPID
    const isFCM = !!token;

    if (!isFCM && (!subscription || !subscription.endpoint)) {
      return NextResponse.json(
        { error: 'Invalid subscription or token' },
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
      location = {};
    }

    let existing;

    if (isFCM) {
      // Find by FCM token
      existing = await PushSubscription.findOne({ fcmToken: token });
    } else {
      // Find by VAPID endpoint
      existing = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    }

    const subscriptionData = {
      location,
      notificationsEnabled,
      adhanAudioEnabled,
      lastNotificationSent: existing?.lastNotificationSent || null // Preserve last sent time
    };

    if (isFCM) {
      subscriptionData.fcmToken = token;
      subscriptionData.tokenType = 'fcm';
      // Mongoose/Mongo unique sparse index fails on explicit nulls sometimes. 
      // Ensure we don't set endpoint at all.
      subscriptionData.endpoint = undefined;
      subscriptionData.keys = undefined;
    } else {
      subscriptionData.endpoint = subscription.endpoint;
      subscriptionData.keys = subscription.keys;
      subscriptionData.tokenType = 'vapid';
    }

    if (existing) {
      console.log('DEBUG: Updating existing subscription');
      // Update existing
      Object.assign(existing, subscriptionData);
      await existing.save();
      console.log('DEBUG: Update successful');
      return NextResponse.json({
        success: true,
        message: 'Subscription updated',
        subscription: existing
      });
    } else {
      console.log('DEBUG: Creating new subscription');
      // Create new
      try {
        const newSubscription = await PushSubscription.create(subscriptionData);
        console.log('DEBUG: Creation successful', newSubscription._id);
        return NextResponse.json({
          success: true,
          message: 'Subscription created',
          subscription: newSubscription
        });
      } catch (createError) {
        console.error('DEBUG: Creation failed', createError);

        // Self-healing: If stale unique index on 'endpoint' exists, drop it and retry
        if (createError.code === 11000 && createError.message.includes('endpoint_1')) {
          console.log('DEBUG: Stale index detected. Dropping "endpoint_1" index...');
          try {
            await PushSubscription.collection.dropIndex('endpoint_1');
            console.log('DEBUG: Index dropped. Retrying creation...');
            const retrySubscription = await PushSubscription.create(subscriptionData);
            return NextResponse.json({
              success: true,
              message: 'Subscription created (after index fix)',
              subscription: retrySubscription
            });
          } catch (retryError) {
            console.error('DEBUG: Retry failed', retryError);
            throw retryError;
          }
        }

        // Handle duplicate key error gracefully if race condition (e.g. fcmToken)
        if (createError.code === 11000) {
          return NextResponse.json({ success: true, message: 'Subscription already exists' });
        }
        throw createError;
      }
    }

  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription', details: error.message },
      { status: 500 }
    );
  }
}
