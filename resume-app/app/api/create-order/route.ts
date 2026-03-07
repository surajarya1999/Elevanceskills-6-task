import { NextRequest, NextResponse } from "next/server";
import { razorpay, RESUME_PRICE_PAISE } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    const order = await razorpay.orders.create({
      amount: RESUME_PRICE_PAISE,
      currency: "INR",
      receipt: `resume_${Date.now()}`,
      notes: { email, name },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ success: false, message: "Failed to create payment order" }, { status: 500 });
  }
}
