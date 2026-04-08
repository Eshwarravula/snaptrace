import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { DEMO_CASES } from "@/lib/constants";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(DEMO_CASES);
  }

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, city, description, urgency, category, categoryLabel, expertId } = body;

  const supabase = getSupabase();
  if (!supabase) {
    // Demo mode — return a fake response
    return NextResponse.json({
      id: `PF-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      client_name: name,
      client_phone: phone,
      city,
      category,
      category_label: categoryLabel,
      description,
      urgency: urgency || "normal",
      expert_id: expertId || null,
      status: "new",
      user_paid: 0,
      expert_paid: false,
      created_at: new Date().toISOString(),
    }, { status: 201 });
  }

  // Generate case ID
  const { count } = await supabase.from("cases").select("*", { count: "exact", head: true });
  const caseId = `PF-${String((count || 0) + 1).padStart(3, "0")}`;

  const { data, error } = await supabase.from("cases").insert({
    id: caseId,
    client_name: name,
    client_phone: phone,
    city,
    category,
    category_label: categoryLabel,
    description,
    urgency: urgency || "normal",
    expert_id: expertId || null,
    status: "new",
    user_paid: 0,
    expert_paid: false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "Case ID required" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ id, ...updates });
  }

  const { data, error } = await supabase
    .from("cases")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
