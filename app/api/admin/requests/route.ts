import { NextResponse } from "next/server";
import { adminOk, supabase } from "@/lib/server";
export async function GET(req:Request){if(!adminOk(req))return NextResponse.json({error:"Unauthorized"},{status:401});if(!supabase)return NextResponse.json({error:"Supabase is not connected yet."},{status:500});const {data,error}=await supabase.from("paperfix_requests").select("*").order("created_at",{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({requests:data||[]});}
