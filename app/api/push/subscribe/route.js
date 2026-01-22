import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/models/PushSubscription';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
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
      // We don't store keys or endpoint for FCM
    } else {
      subscriptionData.endpoint = subscription.endpoint;
      subscriptionData.keys = subscription.keys;
      subscriptionData.tokenType = 'vapid';
    }

    if (existing) {
      // Update existing
      Object.assign(existing, subscriptionData);
      await existing.save();
      return NextResponse.json({
        success: true,
        message: 'Subscription updated',
        subscription: existing
      });
    } else {
      // Create new
      try {
        const newSubscription = await PushSubscription.create(subscriptionData);
        return NextResponse.json({
          success: true,
          message: 'Subscription created',
          subscription: newSubscription
        });
      } catch (createError) {
        // Handle duplicate key error gracefully if race condition
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
