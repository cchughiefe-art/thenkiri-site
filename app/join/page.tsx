"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const response = await fetch("/api/testers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data?.error || "Could not register you right now.");
      return;
    }

    localStorage.setItem("nkiri_beta_token", data.accessToken);
    localStorage.setItem("nkiri_tester_id", data.testerId);
    router.push("/download");
  }

  return (
    <main className="form-wrap">
      <span className="eyebrow"><span className="dot"/> Beta registration</span>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.8rem)"}}>Join TheNkiri beta.</h1>
      <p className="section-lead">
        Tell us what device you are testing on and how we can contact you about beta issues.
        Your contact details are private and are not shown to other testers.
      </p>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <div className="field"><label>Name or nickname</label><input name="name" required minLength={2} maxLength={80} placeholder="What should we call you?" /></div>
          <div className="field"><label>Country</label><input name="country" required maxLength={80} placeholder="Nigeria" /></div>
          <div className="field">
            <label>Contact method</label>
            <select name="contactMethod" required defaultValue="telegram">
              <option value="telegram">Telegram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="x">X / Twitter</option>
            </select>
          </div>
          <div className="field"><label>Contact detail</label><input name="contactValue" required maxLength={160} placeholder="@username, number or email" /></div>
          <div className="field"><label>Phone brand / model</label><input name="deviceModel" required maxLength={120} placeholder="e.g. Infinix X6725B" /></div>
          <div className="field"><label>Android version</label><input name="androidVersion" required maxLength={30} placeholder="e.g. Android 15" /></div>
          <div className="field">
            <label>Main testing focus</label>
            <select name="focus" required defaultValue="playback">
              <option value="playback">Playback</option>
              <option value="downloads">Downloads</option>
              <option value="search">Search & catalog</option>
              <option value="ui">UI / UX</option>
              <option value="compatibility">Device compatibility</option>
              <option value="general">General testing</option>
            </select>
          </div>
          <div className="field"><label>How did you hear about us?</label><input name="source" maxLength={120} placeholder="Telegram, friend, X..." /></div>
          <div className="field full"><label>Anything we should know? <span className="small">(optional)</span></label><textarea name="notes" maxLength={1200} placeholder="Anything about your device, network, or what you want to test." /></div>
          <div className="field full">
            <label style={{display:"flex",gap:10,alignItems:"flex-start",fontWeight:500}}>
              <input name="consent" value="yes" type="checkbox" required style={{width:18,marginTop:3}} />
              <span className="note">I understand this is beta software. I agree that TheNkiri may store these details and contact me about testing, bugs and beta updates.</span>
            </label>
          </div>
        </div>

        {status === "error" && <p className="error">{message}</p>}
        <button className="btn btn-primary" disabled={status === "loading"} style={{width:"100%",marginTop:18}}>
          {status === "loading" ? "Joining beta…" : "Join beta & continue"}
        </button>
      </form>
    </main>
  );
}
