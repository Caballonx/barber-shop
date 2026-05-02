import { prisma } from "./prisma";

export async function saveSubscription(subscription: any, userId?: string) {
  const { endpoint, keys } = subscription;
  const { p256dh, auth } = keys;

  return await prisma.pushSubscription.create({
    data: {
      endpoint,
      p256dh,
      auth,
      userId,
    },
  });
}

export async function getSubscriptionsByUserId(userId: string) {
  return await prisma.pushSubscription.findMany({
    where: { userId },
  });
}

export async function getAllSubscriptions() {
  return await prisma.pushSubscription.findMany();
}

export async function deleteSubscription(endpoint: string) {
  return await prisma.pushSubscription.delete({
    where: { endpoint },
  });
}
