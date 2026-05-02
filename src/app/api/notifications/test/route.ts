import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import { getAllSubscriptions } from "@/lib/db/notifications";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins should be able to send test notifications
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await getAllSubscriptions();
    
    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };
          
          await sendNotification(pushSubscription, {
            title: "Prueba de Notificación",
            body: "Esta es una notificación de prueba de FADE Barbershop",
            url: "/admin",
          });
          return { endpoint: sub.endpoint, success: true };
        } catch (error) {
          return { endpoint: sub.endpoint, success: false, error };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
