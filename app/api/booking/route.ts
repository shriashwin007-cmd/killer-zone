import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import crypto from "crypto";

function verifyRazorpay(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name, phone, room, players, hours, date, time, notes,
    sessionAmount, addonsAmount, totalAmount,
    cart = [],
    razorpayPaymentId, razorpayOrderId, razorpaySignature,
  } = body;

  const paymentVerified =
    razorpayPaymentId && razorpayOrderId && razorpaySignature
      ? verifyRazorpay(razorpayOrderId, razorpayPaymentId, razorpaySignature)
      : false;

  const status = paymentVerified ? "confirmed" : "pending";

  // Save booking
  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      name, phone, room,
      players: parseInt(players) || 1,
      hours: parseInt(hours) || 1,
      date, time_slot: time, notes,
      session_amount: sessionAmount,
      addons_amount: addonsAmount || 0,
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

  // Save payment record if paid
  if (paymentVerified && booking) {
    await supabase.from("payments").insert({
      booking_id: booking.id,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      amount: totalAmount,
      status: "success",
    });

    // Block the time slot
    if (date && time) {
      const startHour = parseInt(time.split(":")[0]) || 18;
      await supabase.from("slot_blocks").insert({
        booking_id: booking.id,
        room,
        date,
        start_hour: startHour,
        end_hour: startHour + (parseInt(hours) || 1),
      });
    }
  }

  return NextResponse.json({ success: true, bookingId: booking?.id, status });
}
