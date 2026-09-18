"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) { setError("Invalid admin password."); return; }
    location.reload();
  }

  return (
    <main className="form-wrap">
      <h1 style={{fontSize:"3rem"}}>Beta admin</h1>
      <form className="form-card" onSubmit={login}>
        <div className="field"><label>Admin password</label><input name="password" type="password" required /></div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" style={{width:"100%",marginTop:16}}>Sign in</button>
      </form>
    </main>
  );
}
