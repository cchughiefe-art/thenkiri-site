import { NextRequest, NextResponse } from "next/server";

const APK_URL =
  "https://github.com/cchughiefe-art/nkiri-bot/releases/download/beta-8/TheNkiri-v3.1.0-beta1.apk";

const APK_NAME =
  "TheNkiri-v3.1.0-beta1.apk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const range = req.headers.get("range");

    const upstream = await fetch(APK_URL, {
      redirect: "follow",
      cache: "no-store",
      headers: range ? { Range: range } : {}
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: "APK download source is unavailable." },
        { status: 502 }
      );
    }

    const headers = new Headers();

    headers.set(
      "Content-Type",
      upstream.headers.get("content-type") ||
        "application/vnd.android.package-archive"
    );

    headers.set(
      "Content-Disposition",
      `attachment; filename="${APK_NAME}"`
    );

    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");

    const contentLength =
      upstream.headers.get("content-length");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    const contentRange =
      upstream.headers.get("content-range");

    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Could not start APK download." },
      { status: 500 }
    );
  }
}
