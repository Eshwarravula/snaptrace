import { NextResponse } from "next/server";
import { messages, statuses, StatusValue } from "@/lib/paperfix";
import { adminOk, supabase } from "@/lib/server";
type Params={params:{token:string}};
export async function PATCH(req:Request,{params}:Params){if(!adminOk(req))return NextResponse.json({error:"Unauthorized"},{status:401});if(!supabase)return NextResponse.json({error:"Supabase is not connected yet."},{status:500});const body=await req.json();const status=body.status as StatusValue;if(!statuses.includes(status))return NextResponse.json({error:"Invalid status."},{status:400});const {data,error}=await supabase.from("paperfix_requests").update({status,status_message:body.status_message||messages[status],internal_note:body.internal_note||null}).eq("token",params.token.trim().toUpperCase()).select().single();if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({request:data});}
