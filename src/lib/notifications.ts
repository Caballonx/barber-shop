import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@fadebarbershop.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

export async function sendNotification(subscription: any, payload: any) {
  try {
    const response = await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export async function notifyAdmins(payload: { title: string; body: string; url?: string }) {
  const { getAllSubscriptions } = await import('@/lib/db/notifications');
  const subscriptions = await getAllSubscriptions();

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };
      return await sendNotification(pushSubscription, payload);
    })
  );

  return results;
}
