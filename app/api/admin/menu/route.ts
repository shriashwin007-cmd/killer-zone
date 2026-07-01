import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import crypto from "crypto";

function checkAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Public — frontend reads this to know which items are hidden/out-of-stock
export async function GET() {
  const { data, error } = await supabase
    .from("menu_overrides")
    .select("item_id, out_of_stock, hidden");
  if (error) return NextResponse.json({ overrides: [] });
  return NextResponse.json({ overrides: data ?? [] });
}

// Admin — toggle out_of_stock or hidden for an item
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { item_id, field, value } = await req.json();
  if (!item_id || !field) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { error } = await supabase
    .from("menu_overrides")
    .upsert({ item_id, [field]: value }, { onConflict: "item_id" });

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
