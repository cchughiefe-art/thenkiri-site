import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  contactMethod: z.enum(["telegram", "whatsapp", "email", "x"]),
  contactValue: z.string().trim().min(3).max(160),
  deviceModel: z.string().trim().min(2).max(120),
  androidVersion: z.string().trim().min(2).max(30),
  focus: z.enum(["playback", "downloads", "search", "ui", "compatibility", "general"]),
  source: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(1200).optional().default(""),
  consent: z.literal("yes")
});

function testerCode() {
  return `NK-BETA-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  let createdUserId: string | null = null;

  try {
    const body = schema.parse(await request.json());
    const supabase = supabaseAdmin();

    const existing = await supabase.from("beta_testers").select("id").ilike("email", body.email).maybeSingle();
    if (existing.data) return NextResponse.json({ error: "An account already exists for this email. Please log in." }, { status: 409 });

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      const msg = authError?.message?.toLowerCase().includes("already")
        ? "An account already exists for this email. Please log in."
        : authError?.message || "Could not create account.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    createdUserId = authData.user.id;
    const testerId = testerCode();

    const { error } = await supabase.from("beta_testers").insert({
      tester_code: testerId,
      auth_user_id: authData.user.id,
      email: body.email,
      name: body.name,
      country: body.country,
      contact_method: body.contactMethod,
      contact_value: body.contactValue,
      device_model: body.deviceModel,
      android_version: body.androidVersion,
      focus: body.focus,
      source: body.source || null,
      notes: body.notes || null,
      consented_at: new Date().toISOString()
    });

    if (error) throw error;
    return NextResponse.json({ ok: true, testerId });
  } catch (error: any) {
    if (createdUserId) {
      try { await supabaseAdmin().auth.admin.deleteUser(createdUserId); } catch {}
    }
    const message = error?.issues?.[0]?.message || error?.message || "Registration failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
