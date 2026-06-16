import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { cartTotal, sessionTotal } from "@/app/lib/pricing";
import { rateLimit, clientIp } from "@/app/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 15 order-creations per minute per IP
  if (!rateLimit(`pay:${clientIp(req)}`, 15, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const body = await req.json();
    const { cart, players, hours, description = "Killer Zone Payment" } = body ?? {};

    // ── Authoritative amount: recompute server-side, ignore any client total ──
    const addons  = cartTotal(cart);
    const session = players != null || hours != null ? sessionTotal(players, hours) : 0;
    const amount  = addons + session;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }

    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `kz_${Date.now()}`,
      notes: { description: String(description).slice(0, 200) },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Payment order error:", err);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }
}
