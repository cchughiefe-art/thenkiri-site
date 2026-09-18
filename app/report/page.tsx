"use client";

import { FormEvent, useState } from "react";

export default function ReportPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    setError("");

    const token = localStorage.getItem("nkiri_beta_token");
    if (!token) { location.href = "/join"; return; }

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus("");
      setError(data?.error || "Could not submit report.");
      return;
    }

    (e.currentTarget as HTMLFormElement).reset();
    setStatus(`Report sent. Reference: ${data.reportCode}`);
  }

  return (
    <main className="form-wrap">
      <span className="eyebrow">Beta feedback</span>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.8rem)"}}>Report a problem.</h1>
      <p className="section-lead">Tell us exactly what happened. Your tester ID and device details are attached automatically.</p>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Problem area</label>
            <select name="category" required>
              <option value="playback">Playback</option>
              <option value="downloads">Downloads</option>
              <option value="search">Search</option>
              <option value="ui">UI / UX</option>
              <option value="compatibility">Compatibility</option>
              <option value="crash">Crash</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field"><label>App version</label><input name="appVersion" required placeholder="e.g. 3.1.0-beta1" /></div>
          <div className="field full"><label>What happened?</label><textarea name="description" required minLength={10} maxLength={4000} placeholder="What did you do, what did you expect, and what happened instead?" /></div>
          <div className="field full"><label>Screenshot or short video <span className="small">(optional, max 15 MB)</span></label><input name="attachment" type="file" accept="image/*,video/mp4,video/webm" /></div>
        </div>

        {error && <p className="error">{error}</p>}
        {status && <p className="success">{status}</p>}
        <button className="btn btn-primary" style={{width:"100%",marginTop:18}}>Send report</button>
      </form>
    </main>
  );
}
