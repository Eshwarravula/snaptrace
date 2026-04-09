import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, case_id, client_name, client_phone } = await req.json();

  if (!amount || !case_id) {
    return NextResponse.json({ error: "Amount and case_id required" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // Demo mode
    return NextResponse.json({
      order_id: `order_demo_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: "INR",
      key_id: "demo",
    });
  }

  try {
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: case_id,
      notes: {
        case_id,
        client_name: client_name || "",
        client_phone: client_phone || "",
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
