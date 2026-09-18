import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return NextResponse.json({ error: "Missing login session." }, { status: 401 });

  const supabase = supabaseAdmin();
  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) return NextResponse.json({ error: "Your login session is invalid or expired." }, { status: 401 });

  const { data: tester, error } = await supabase
    .from("beta_testers")
    .select("id,tester_code,name,email,country,device_model,android_version,focus,created_at")
    .eq("auth_user_id", auth.user.id)
    .maybeSingle();

  if (error || !tester) return NextResponse.json({ error: "Tester profile not found." }, { status: 404 });

  const { data: reports } = await supabase
    .from("beta_reports")
    .select("report_code,category,app_version,description,status,created_at")
    .eq("tester_id", tester.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const { id, ...safeTester } = tester;
  return NextResponse.json({ tester: safeTester, reports: reports || [] });
}
