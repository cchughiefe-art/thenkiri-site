"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function ReportPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabaseBrowser().auth.getSession().then(({ data }) => {
      if (!data.session) location.href = "/login";
      else setReady(true);
    });
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    setError("");
    const { data } = await supabaseBrowser().auth.getSession();
    const token = data.session?.access_token;
    if (!token) { location.href = "/login"; return; }

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/reports", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
    const result = await response.json();
    if (!response.ok) { setStatus(""); setError(result?.error || "Could not submit report."); return; }
    (e.currentTarget as HTMLFormElement).reset();
    setStatus(`Report sent. Reference: ${result.reportCode}`);
  }

  if (!ready) return <main className="form-wrap"><p className="note">Checking your tester account…</p></main>;

  return (
    <main className="form-wrap">
      <span className="eyebrow">Beta feedback</span>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.8rem)"}}>Report a problem.</h1>
      <p className="section-lead">Your tester account and device details are attached automatically. You can track this report later from My Account.</p>
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <div className="field"><label>Problem area</label><select name="category" required defaultValue="other"><option value="playback">Playback</option><option value="downloads">Downloads</option><option value="search">Search</option><option value="ui">UI / UX</option><option value="compatibility">Compatibility</option><option value="crash">Crash</option><option value="account">Account / login</option><option value="suggestion">Suggestion</option><option value="other">Other complaint</option></select></div>
          <div className="field"><label>App version</label><input name="appVersion" required defaultValue="3.1.0-beta1" /></div>
          <div className="field full"><label>What happened?</label><textarea name="description" required minLength={10} maxLength={4000} placeholder="Tell us what happened, what you expected, and anything that could help us reproduce it." /></div>
          <div className="field full"><label>Screenshot or short video <span className="small">(optional, max 15 MB)</span></label><input name="attachment" type="file" accept="image/*,video/mp4,video/webm" /></div>
        </div>
        {error && <p className="error">{error}</p>}
        {status && <p className="success">{status}</p>}
        <button className="btn btn-primary" style={{width:"100%",marginTop:18}}>Send report</button>
        <a className="btn btn-secondary" style={{width:"100%",marginTop:10}} href="/account">Back to my account</a>
      </form>
    </main>
  );
}
