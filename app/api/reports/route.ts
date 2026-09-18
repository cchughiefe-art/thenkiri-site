import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const allowedCategories = new Set(["playback","downloads","search","ui","compatibility","crash","other"]);

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
    if (!token) return NextResponse.json({ error: "Missing tester access." }, { status: 401 });

    const supabase = supabaseAdmin();
    const { data: tester } = await supabase
      .from("beta_testers")
      .select("id,tester_code,device_model,android_version")
      .eq("access_token", token)
      .maybeSingle();

    if (!tester) return NextResponse.json({ error: "Tester access not found." }, { status: 401 });

    const form = await request.formData();
    const category = String(form.get("category") || "");
    const appVersion = String(form.get("appVersion") || "").trim().slice(0, 60);
    const description = String(form.get("description") || "").trim().slice(0, 4000);

    if (!allowedCategories.has(category) || !appVersion || description.length < 10) {
      return NextResponse.json({ error: "Please complete all required report fields." }, { status: 400 });
    }

    let attachmentPath: string | null = null;
    const attachment = form.get("attachment");

    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > 15 * 1024 * 1024) {
        return NextResponse.json({ error: "Attachment must be 15 MB or smaller." }, { status: 400 });
      }
      const safe = attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      attachmentPath = `${tester.tester_code}/${Date.now()}-${safe}`;
      const bytes = Buffer.from(await attachment.arrayBuffer());
      const { error: uploadError } = await supabase.storage
        .from("beta-reports")
        .upload(attachmentPath, bytes, { contentType: attachment.type || "application/octet-stream", upsert: false });
      if (uploadError) throw uploadError;
    }

    const reportCode = `NK-RPT-${randomBytes(3).toString("hex").toUpperCase()}`;
    const { error } = await supabase.from("beta_reports").insert({
      report_code: reportCode,
      tester_id: tester.id,
      category,
      app_version: appVersion,
      description,
      attachment_path: attachmentPath,
      device_model: tester.device_model,
      android_version: tester.android_version
    });

    if (error) throw error;
    return NextResponse.json({ ok: true, reportCode });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Report failed." }, { status: 400 });
  }
}
