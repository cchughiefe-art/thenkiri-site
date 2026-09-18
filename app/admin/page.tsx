import { cookies } from "next/headers";
import { isAdminCookie } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jar = await cookies();
  if (!isAdminCookie(jar.get("nkiri_admin")?.value)) return <AdminLogin/>;

  const supabase = supabaseAdmin();
  const [{ data: testers }, { data: reports }] = await Promise.all([
    supabase.from("beta_testers")
      .select("tester_code,name,country,contact_method,contact_value,device_model,android_version,focus,created_at")
      .order("created_at",{ascending:false}).limit(250),
    supabase.from("beta_reports")
      .select("report_code,category,app_version,device_model,android_version,description,created_at")
      .order("created_at",{ascending:false}).limit(100)
  ]);

  return (
    <main className="shell section">
      <span className="eyebrow">Private admin</span>
      <h1 style={{fontSize:"clamp(2.6rem,6vw,5rem)"}}>Beta operations.</h1>

      <div className="kpis">
        <div className="kpi"><span className="small">Testers</span><strong>{testers?.length || 0}</strong></div>
        <div className="kpi"><span className="small">Reports</span><strong>{reports?.length || 0}</strong></div>
        <div className="kpi"><span className="small">Playback focus</span><strong>{testers?.filter((x:any)=>x.focus==="playback").length || 0}</strong></div>
        <div className="kpi"><span className="small">Compatibility focus</span><strong>{testers?.filter((x:any)=>x.focus==="compatibility").length || 0}</strong></div>
      </div>

      <h2 style={{marginTop:42}}>Testers</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Device</th><th>Android</th><th>Focus</th><th>Joined</th></tr></thead>
          <tbody>
            {(testers || []).map((t:any) => (
              <tr key={t.tester_code}>
                <td><span className="badge">{t.tester_code}</span></td>
                <td>{t.name}<div className="small">{t.country}</div></td>
                <td>{t.contact_method}: {t.contact_value}</td>
                <td>{t.device_model}</td>
                <td>{t.android_version}</td>
                <td>{t.focus}</td>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{marginTop:42}}>Recent reports</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Ref</th><th>Area</th><th>Version</th><th>Device</th><th>Description</th><th>Date</th></tr></thead>
          <tbody>
            {(reports || []).map((r:any) => (
              <tr key={r.report_code}>
                <td><span className="badge">{r.report_code}</span></td>
                <td>{r.category}</td>
                <td>{r.app_version}</td>
                <td>{r.device_model}<div className="small">{r.android_version}</div></td>
                <td style={{maxWidth:380}}>{r.description}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
