"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

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
      setMessage(data?.error || "Could not create your tester account.");
      return;
    }

    const email = String(body.email || "");
    const password = String(body.password || "");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setMessage("Account created, but automatic login failed. Please use the Login page.");
      return;
    }

    router.push("/account");
  }

  return (
    <main className="form-wrap">
      <span className="eyebrow"><span className="dot"/> Beta registration</span>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.8rem)"}}>Create your tester account.</h1>
      <p className="section-lead">
        Register once, then log back in from any browser to download TheNkiri, send complaints,
        and track your beta reports.
      </p>

      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <div className="field"><label>Email</label><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></div>
          <div className="field"><label>Password</label><input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" /></div>
          <div className="field"><label>Name or nickname</label><input name="name" required minLength={2} maxLength={80} placeholder="What should we call you?" /></div>
          <div className="field"><label>Country</label><input name="country" required maxLength={80} placeholder="Nigeria" /></div>
          <div className="field"><label>Contact method</label><select name="contactMethod" required defaultValue="telegram"><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="x">X / Twitter</option></select></div>
          <div className="field"><label>Contact detail</label><input name="contactValue" required maxLength={160} placeholder="@username, number or email" /></div>
          <div className="field"><label>Phone brand / model</label><input name="deviceModel" required maxLength={120} placeholder="e.g. Infinix X6725B" /></div>
          <div className="field"><label>Android version</label><input name="androidVersion" required maxLength={30} placeholder="e.g. Android 15" /></div>
          <div className="field"><label>Main testing focus</label><select name="focus" required defaultValue="general"><option value="playback">Playback</option><option value="downloads">Downloads</option><option value="search">Search & catalog</option><option value="ui">UI / UX</option><option value="compatibility">Device compatibility</option><option value="general">General testing</option></select></div>
          <div className="field"><label>How did you hear about us?</label><input name="source" maxLength={120} placeholder="Telegram, friend, X..." /></div>
          <div className="field full"><label>Anything we should know? <span className="small">(optional)</span></label><textarea name="notes" maxLength={1200} placeholder="Anything about your device, network, or what you want to test." /></div>
          <div className="field full"><label style={{display:"flex",gap:10,alignItems:"flex-start",fontWeight:500}}><input name="consent" value="yes" type="checkbox" required style={{width:18,marginTop:3}} /><span className="note">I understand this is beta software. I agree that TheNkiri may store these details and contact me about testing, bugs and beta updates.</span></label></div>
        </div>

        {status === "error" && <p className="error">{message}</p>}
        <button className="btn btn-primary" disabled={status === "loading"} style={{width:"100%",marginTop:18}}>{status === "loading" ? "Creating account…" : "Create account & join beta"}</button>
        <p className="note" style={{textAlign:"center",marginTop:16}}>Already registered? <a href="/login" style={{color:"#d7c1ff",fontWeight:800}}>Log in</a></p>
      </form>
    </main>
  );
}
