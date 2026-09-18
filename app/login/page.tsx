"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabaseBrowser().auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/account");
    });
  }, [router]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/account");
  }

  return (
    <main className="form-wrap">
      <span className="eyebrow">Tester login</span>
      <h1 style={{fontSize:"clamp(2.5rem,7vw,4.8rem)"}}>Welcome back.</h1>
      <p className="section-lead">Log in to download the latest beta and send or review your complaints.</p>

      <form className="form-card" onSubmit={submit}>
        <div className="field"><label>Email</label><input name="email" type="email" required autoComplete="email" /></div>
        <div className="field" style={{marginTop:16}}><label>Password</label><input name="password" type="password" required autoComplete="current-password" /></div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={loading} style={{width:"100%",marginTop:18}}>
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="note" style={{textAlign:"center",marginTop:16}}>
          New tester? <a href="/join" style={{color:"#d7c1ff",fontWeight:800}}>Create an account</a>
        </p>
      </form>
    </main>
  );
}
