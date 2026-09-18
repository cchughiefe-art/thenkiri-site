import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
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
  try {
    const body = schema.parse(await request.json());
    const accessToken = randomBytes(32).toString("hex");
    const testerId = testerCode();

    const { error } = await supabaseAdmin()
      .from("beta_testers")
      .insert({
        tester_code: testerId,
        access_token: accessToken,
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

    return NextResponse.json({ ok: true, testerId, accessToken });
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || error?.message || "Registration failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
