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

const RELEASE_REPO = "cchughiefe-art/nkiri-bot";
const RELEASE_TAG = "beta-9";
const APK_NAME = "TheNkiri-v3.1.0-beta2.apk";

export async function getRelease(): Promise<ReleaseInfo> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${RELEASE_REPO}/releases/tags/${RELEASE_TAG}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "TheNkiri-Site/1.0"
        },
        next: { revalidate: 120 }
      }
    );

    if (response.ok) {
      const release = await response.json() as any;

      const asset = Array.isArray(release.assets)
        ? release.assets.find(
            (item: any) => String(item.name || "") === APK_NAME
          )
        : null;

      if (asset) {
        const digest =
          typeof asset.digest === "string" &&
          asset.digest.startsWith("sha256:")
            ? asset.digest.slice(7)
            : null;

        return {
          versionName: "3.1.0-beta2",
          versionCode: 9,
          downloadUrl: asset.browser_download_url,
          size: humanSize(Number(asset.size || 0)),
          sha256: digest,
          releasedAt: release.published_at || null,
          channel: "beta",
          source: "github"
        };
      }
    }
  } catch {}

  return {
    versionName: "3.1.0-beta2",
    versionCode: 9,
    downloadUrl:
      "https://github.com/cchughiefe-art/nkiri-bot/releases/download/beta-9/TheNkiri-v3.1.0-beta2.apk",
    size: "3.9 MB",
    sha256:
      "348d8501ad81b672e69ea95a583f721afe80db2c039c44c140b7aa4d8dae56b4",
    releasedAt: null,
    channel: "beta",
    source: "env"
  };
}
