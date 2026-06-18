import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { rateLimit, clientIp } from "@/app/lib/rateLimit";
import crypto from "crypto";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false; // never allow if no password configured
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  // constant-time compare (avoids timing attacks); length guard first
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  // Throttle auth attempts: 12 per 10 min per IP (blocks brute force)
  if (!rateLimit(`admin:${clientIp(req)}`, 12, 600_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`*, payments(razorpay_payment_id, amount, status, created_at)`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }

  return NextResponse.json({ bookings });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
