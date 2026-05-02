import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import { saveSubscription } from "@/lib/db/notifications";
import { pushSubscriptionSchema } from "@/lib/validations/schemas";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // Validate input with Zod
    const validation = pushSubscriptionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid subscription data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const subscription = validation.data;
    const userId = session?.user?.id;

    await saveSubscription(subscription, userId);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Subscription error:", error);
    // Avoid exposing DB details to client
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
