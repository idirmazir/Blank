import { NextRequest, NextResponse } from "next/server";

import { createReturnRequest } from "@/lib/orders/returns";
import { getSessionUser } from "@/lib/auth/helpers";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, orderItemId, reason } = body;

    if (!orderId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const returnId = await createReturnRequest(orderId, orderItemId || null, reason, user.id);

    return NextResponse.json({ id: returnId, status: "requested" });
  } catch (error) {
    console.error("Return request error:", error);
    return NextResponse.json({ error: "Failed to create return request" }, { status: 500 });
  }
}
