import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { cartTotal, sessionTotal } from "@/app/lib/pricing";
import { rateLimit, clientIp } from "@/app/lib/rateLimit";
import crypto from "crypto";

function verifyRazorpay(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const str = (v: unknown, max: number) =>
  (typeof v === "string" ? v : v == null ? "" : String(v)).trim().slice(0, max);

export async function POST(req: NextRequest) {
  // Rate limit: 10 bookings per minute per IP
  if (!rateLimit(`book:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // ── Validate & sanitize inputs ──────────────────────────────────────────
  const name  = str(body.name, 100);
  const phone = str(body.phone, 20);
  const room  = str(body.room, 100);
  const date  = str(body.date, 20);
  const time  = str(body.time, 10);
  const notes = str(body.notes, 1000);
  const players = Math.max(1, Math.min(50, parseInt(String(body.players)) || 1));
  const hours   = Math.max(1, Math.min(12, parseInt(String(body.hours)) || 1));
  const cart    = Array.isArray(body.cart) ? body.cart.slice(0, 100) : [];

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone required" }, { status: 400 });
  }
  if (!/^[+\d][\d\s-]{4,}$/.test(phone)) {
    return NextResponse.json({ error: "invalid phone" }, { status: 400 });
  }

  // ── Authoritative amounts (never trust client-sent totals) ──────────────
  const sessionAmount = sessionTotal(players, hours);
  const addonsAmount  = cartTotal(cart);
  const totalAmount   = sessionAmount + addonsAmount;

  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = body as {
    razorpayPaymentId?: string; razorpayOrderId?: string; razorpaySignature?: string;
  };

  const paymentVerified =
    razorpayPaymentId && razorpayOrderId && razorpaySignature
      ? verifyRazorpay(razorpayOrderId, razorpayPaymentId, razorpaySignature)
      : false;

  const status = paymentVerified ? "confirmed" : "pending";

  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      name, phone, room,
      players, hours,
      date, time_slot: time, notes,
      session_amount: sessionAmount,
      addons_amount: addonsAmount,
      total_amount: totalAmount,
      cart_items: cart,
      status,
    })
    .select()
    .single();

  if (bookingErr) {
    console.error("Booking insert error:", bookingErr);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }

  if (paymentVerified && booking) {
    await supabase.from("payments").insert({
      booking_id: booking.id,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      amount: totalAmount,
      status: "success",
    });

    if (date && time) {
      const startHour = parseInt(time.split(":")[0]) || 18;
      await supabase.from("slot_blocks").insert({
        booking_id: booking.id,
        room, date,
        start_hour: startHour,
        end_hour: startHour + hours,
      });
    }
  }

  return NextResponse.json({ success: true, bookingId: booking?.id, status });
}
