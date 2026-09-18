"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Tester = { tester_code:string; name:string; device_model:string; android_version:string; focus:string; };
type Release = { versionName:string; versionCode:number; downloadUrl:string|null; size:string|null; sha256:string|null; releasedAt:string|null; };

export default function DownloadPage() {
  const [tester, setTester] = useState<Tester|null>(null);
  const [release, setRelease] = useState<Release|null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser().auth.getSession();
      const token = data.session?.access_token;
      if (!token) { location.href = "/login"; return; }

      const [meResponse, releaseResponse] = await Promise.all([
        fetch("/api/testers/me", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/release")
      ]);

      if (!meResponse.ok) {
        await supabaseBrowser().auth.signOut();
        location.href = "/login";
        return;
      }

      const me = await meResponse.json();
      const rel = await releaseResponse.json();
      setTester(me.tester);
      setRelease(rel);
    })().catch(() => setError("Could not load beta download details."));
  }, []);

  if (error) return <main className="form-wrap"><p className="error">{error}</p></main>;
  if (!tester || !release) return <main className="form-wrap"><p className="note">Loading your beta access…</p></main>;

  return (
    <main className="form-wrap">
      <p className="success">Signed in as <strong>{tester.tester_code}</strong>.</p>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.6rem)"}}>Download TheNkiri.</h1>
      <p className="section-lead">Thanks, {tester.name}. This build is linked to your tester account for {tester.device_model} running {tester.android_version}.</p>
      <div className="form-card">
        <span className="badge">LATEST BETA</span>
        <h2 style={{fontSize:"2rem",marginBottom:8}}>{release.versionName}</h2>
        <p className="note">{release.size ? `${release.size} · ` : ""}Android 10+ · APK</p>
        {release.downloadUrl ? <a className="btn btn-primary" style={{width:"100%",marginTop:14}} href="/api/download" download>Download APK</a> : <p className="error">The APK is temporarily unavailable.</p>}
        {release.sha256 && <div><h3>SHA-256</h3><p className="small code">{release.sha256}</p></div>}
        <div className="actions"><a className="btn btn-secondary" href="/account">My account</a><a className="btn btn-secondary" href="/report">Report a problem</a></div>
      </div>
    </main>
  );
}
