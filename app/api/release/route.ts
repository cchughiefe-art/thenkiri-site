import { NextResponse } from "next/server";
import { getRelease } from "@/lib/release";

export async function GET() {
  return NextResponse.json(await getRelease());
}
