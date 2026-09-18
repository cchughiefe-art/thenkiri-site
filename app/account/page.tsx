"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Tester = { tester_code:string; name:string; email:string|null; country:string; device_model:string; android_version:string; focus:string; created_at:string; };
type Report = { report_code:string; category:string; app_version:string; description:string; status:string; created_at:string; };

export default function AccountPage() {
  const [tester, setTester] = useState<Tester|null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser().auth.getSession();
      const token = data.session?.access_token;
      if (!token) { location.href = "/login"; return; }

      const response = await fetch("/api/testers/me", { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json();

      if (!response.ok) {
        await supabaseBrowser().auth.signOut();
        location.href = "/login";
        return;
      }

      setTester(body.tester);
      setReports(body.reports || []);
    })().catch(() => setError("Could not load your tester account."));
  }, []);

  async function logout() {
    await supabaseBrowser().auth.signOut();
    location.href = "/login";
  }

  if (error) return <main className="form-wrap"><p className="error">{error}</p></main>;
  if (!tester) return <main className="form-wrap"><p className="note">Loading your account…</p></main>;

  return (
    <main className="shell section">
      <span className="eyebrow">Tester account</span>
      <h1 style={{fontSize:"clamp(2.6rem,6vw,5rem)"}}>Hi, {tester.name}.</h1>
      <p className="section-lead">Tester ID <strong>{tester.tester_code}</strong> · {tester.device_model} · {tester.android_version}</p>
      <div className="actions"><a className="btn btn-primary" href="/download">Download latest APK</a><a className="btn btn-secondary" href="/report">Send complaint / report</a><button className="btn btn-secondary" onClick={logout}>Log out</button></div>
      <div className="kpis" style={{marginTop:32}}><div className="kpi"><span className="small">Reports</span><strong>{reports.length}</strong></div><div className="kpi"><span className="small">New</span><strong>{reports.filter(r=>r.status==="new").length}</strong></div><div className="kpi"><span className="small">Reviewing</span><strong>{reports.filter(r=>r.status==="reviewing").length}</strong></div><div className="kpi"><span className="small">Fixed / closed</span><strong>{reports.filter(r=>r.status==="fixed"||r.status==="closed").length}</strong></div></div>
      <h2 style={{marginTop:42}}>My complaints & reports</h2>
      {reports.length === 0 ? <div className="form-card"><p className="note">You have not submitted any reports yet.</p></div> : <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Area</th><th>Status</th><th>Description</th><th>Date</th></tr></thead><tbody>{reports.map(r => <tr key={r.report_code}><td><span className="badge">{r.report_code}</span></td><td>{r.category}</td><td>{r.status}</td><td style={{maxWidth:420}}>{r.description}</td><td>{new Date(r.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
    </main>
  );
}
