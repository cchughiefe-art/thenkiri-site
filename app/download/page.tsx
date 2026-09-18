"use client";

import { useEffect, useState } from "react";

type Tester = { tester_code:string; name:string; device_model:string; android_version:string; focus:string; };
type Release = { versionName:string; versionCode:number; downloadUrl:string|null; size:string|null; sha256:string|null; releasedAt:string|null; };

export default function DownloadPage() {
  const [tester, setTester] = useState<Tester|null>(null);
  const [release, setRelease] = useState<Release|null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("nkiri_beta_token");
    if (!token) { location.href = "/join"; return; }

    Promise.all([
      fetch("/api/testers/me", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json().then(x => ({ ok:r.ok, data:x }))),
      fetch("/api/release").then(r => r.json())
    ]).then(([me, rel]) => {
      if (!me.ok) {
        localStorage.removeItem("nkiri_beta_token");
        location.href = "/join";
        return;
      }
      setTester(me.data.tester);
      setRelease(rel);
    }).catch(() => setError("Could not load beta download details."));
  }, []);

  if (error) return <main className="form-wrap"><p className="error">{error}</p></main>;
  if (!tester || !release) return <main className="form-wrap"><p className="note">Loading your beta access…</p></main>;

  return (
    <main className="form-wrap">
      <p className="success">You’re in. Your tester ID is <strong>{tester.tester_code}</strong>.</p>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.6rem)"}}>Download TheNkiri.</h1>
      <p className="section-lead">Thanks, {tester.name}. This build is linked to the beta program for your {tester.device_model} running {tester.android_version}.</p>

      <div className="form-card">
        <span className="badge">LATEST BETA</span>
        <h2 style={{fontSize:"2rem",marginBottom:8}}>{release.versionName}</h2>
        <p className="note">{release.size ? `${release.size} · ` : ""}Android 10+ · APK</p>

        {release.downloadUrl ? (
          <a className="btn btn-primary" style={{width:"100%",marginTop:14}} href="/api/download" download>Download APK</a>
        ) : (
          <p className="error">The APK has not been attached to the beta site yet. Your tester registration is saved.</p>
        )}

        <div style={{marginTop:20}}>
          <h3>Install</h3>
          <ol className="note" style={{lineHeight:1.9,paddingLeft:20}}>
            <li>Download the APK.</li>
            <li>Open it from your browser or Downloads folder.</li>
            <li>If Android asks, allow installs from that browser or file manager.</li>
            <li>Install or update TheNkiri. Keep the same signed package to preserve app data.</li>
          </ol>
        </div>

        {release.sha256 && <div><h3>SHA-256</h3><p className="small code">{release.sha256}</p></div>}

        <div className="actions">
          <a className="btn btn-secondary" href="/report">Report a problem</a>
          <a className="btn btn-secondary" href={process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/voidupdatezone"}>Updates</a>
        </div>
      </div>
    </main>
  );
}
