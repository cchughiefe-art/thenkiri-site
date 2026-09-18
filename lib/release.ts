type ReleaseInfo = {
  versionName: string;
  versionCode: number;
  downloadUrl: string | null;
  size: string | null;
  sha256: string | null;
  releasedAt: string | null;
  channel: "beta";
  source: "github" | "env";
};

function humanSize(bytes: number) {
  if (!bytes) return null;
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
}

export async function getRelease(): Promise<ReleaseInfo> {
  const repo = process.env.RELEASE_REPO || "cchughiefe-art/nkiri-bot";
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "TheNkiri-Site/1.0" },
      next: { revalidate: 120 }
    });
    if (response.ok) {
      const releases = await response.json() as any[];
      const prefix = process.env.RELEASE_TAG_PREFIX || "";
      const release = releases.find((r) =>
        !r.draft &&
        (!prefix || String(r.tag_name || "").startsWith(prefix)) &&
        Array.isArray(r.assets) &&
        r.assets.some((a: any) => String(a.name || "").toLowerCase().endsWith(".apk"))
      );
      if (release) {
        const asset = release.assets.find((a: any) => String(a.name || "").toLowerCase().endsWith(".apk"));
        return {
          versionName: String(release.name || release.tag_name || process.env.APK_VERSION_NAME || "Beta"),
          versionCode: Number(process.env.APK_VERSION_CODE || 0),
          downloadUrl: asset?.browser_download_url || null,
          size: humanSize(Number(asset?.size || 0)),
          sha256: process.env.APK_SHA256 || null,
          releasedAt: release.published_at || null,
          channel: "beta",
          source: "github"
        };
      }
    }
  } catch {}
  return {
    versionName: process.env.APK_VERSION_NAME || "3.1.0-beta1",
    versionCode: Number(process.env.APK_VERSION_CODE || 8),
    downloadUrl: process.env.APK_DOWNLOAD_URL || null,
    size: process.env.APK_SIZE || null,
    sha256: process.env.APK_SHA256 || null,
    releasedAt: null,
    channel: "beta",
    source: "env"
  };
}
