import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { case_id, user_amount, expert_amount, platform_cut } = body;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ id: crypto.randomUUID(), case_id, user_amount, expert_amount, platform_cut, user_payment_status: "pending", expert_payout_status: "pending" }, { status: 201 });
  }

  const { data, error } = await supabase.from("payments").insert({
    case_id,
    user_amount,
    expert_amount,
    platform_cut,
    user_payment_status: "pending",
    expert_payout_status: "pending",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "Payment ID required" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ id, ...updates });
  }

  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
