import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const room = searchParams.get("room");

  if (!date || !room) {
    return NextResponse.json({ blockedHours: [] });
  }

  const { data, error } = await supabase
    .from("slot_blocks")
    .select("start_hour, end_hour")
    .eq("date", date)
    .eq("room", room);

  if (error) {
    return NextResponse.json({ blockedHours: [] });
  }

  const blockedHours: number[] = [];
  for (const block of data ?? []) {
    for (let h = block.start_hour; h < block.end_hour; h++) {
      blockedHours.push(h);
    }
  }

  return NextResponse.json({ blockedHours });
}
