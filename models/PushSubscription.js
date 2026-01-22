import mongoose from 'mongoose';

const PushSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null
    },
    endpoint: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    fcmToken: {
        type: String,
        unique: true,
        sparse: true
    },
    tokenType: {
        type: String,
        enum: ['fcm', 'vapid'],
        default: 'fcm'
    },
    keys: {
        p256dh: {
            type: String
        },
        auth: {
            type: String
        }
    },
    location: {
        lat: Number,
        lng: Number,
        city: String,
        country: String,
        type: { type: String } // Explicit definition to avoid Mongoose thinking 'location' is a String
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    adhanAudioEnabled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastNotificationSent: {
        type: Date,
        default: null
    }
});

// Index for faster queries (endpoint already has unique: true)
PushSubscriptionSchema.index({ notificationsEnabled: 1 });

export default mongoose.models.PushSubscription || mongoose.model('PushSubscription', PushSubscriptionSchema);
