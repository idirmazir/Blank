import { NextRequest, NextResponse } from "next/server";

/**
 * Wise webhook handler.
 * Handles transfer state-change events.
 * 
 * To set up:
 * 1. Go to Wise dashboard → Settings → Webhooks
 * 2. Add endpoint: https://shopblank.com.au/api/wise/webhook
 * 3. Subscribe to: transfers#state-change
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type || body.event?.type;

    if (eventType === "transfers#state-change") {
      const transferId = body.data?.resource?.id || body.data?.id;
      const currentStatus = body.data?.current_state || body.data?.status;

      if (!transferId) {
        return NextResponse.json({ error: "No transfer ID" }, { status: 400 });
      }

      // Update handoff record — handled by checkPendingTransfers or directly
      // For now, log and let polling pick it up
      console.log(`Wise transfer ${transferId} status changed to ${currentStatus}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Wise webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
