import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { EXPERTS_DATA } from "@/lib/constants";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(EXPERTS_DATA);
  }

  const { data, error } = await supabase.from("experts").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
