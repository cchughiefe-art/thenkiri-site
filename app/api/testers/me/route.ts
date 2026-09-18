import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return NextResponse.json({ error: "Missing tester access token." }, { status: 401 });

  const { data, error } = await supabaseAdmin()
    .from("beta_testers")
    .select("tester_code,name,device_model,android_version,focus,created_at")
    .eq("access_token", token)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: "Tester access not found." }, { status: 401 });

  return NextResponse.json({ tester: data });
}
