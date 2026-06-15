import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
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
