const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/voidupdatezone";

export default function HomePage() {
  return (
    <main>
      <section className="shell hero">
        <div>
          <span className="eyebrow"><span className="dot"/> Android beta now open</span>
          <h1><span className="grad">Movies and series, simpler.</span></h1>
          <p>Search, stream and download from one Android app. Join the beta, test TheNkiri on your device, and help us make playback and downloads more reliable before public launch.</p>
          <div className="actions">
            <a className="btn btn-primary" href="/join">Join beta & download</a>
            <a className="btn btn-secondary" href={telegram} target="_blank">Telegram updates</a>
          </div>
          <p className="small">Android 10+ · Beta access · No Play Store required</p>
        </div>
        <div className="phone" aria-hidden>
          <div className="phone-screen">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><strong>TheNkiri</strong><span className="badge">BETA</span></div>
            <div className="poster"><span className="badge" style={{width:"max-content"}}>Featured</span><h3 style={{fontSize:"1.7rem",margin:"12px 0 6px"}}>Tonight starts here.</h3><span className="small">Find a title. Pick a source. Watch or download.</span></div>
            <div className="minirow"><div className="mini"/><div className="mini"/><div className="mini"/></div>
            <div className="minirow"><div className="mini"/><div className="mini"/><div className="mini"/></div>
          </div>
        </div>
      </section>
      <section className="section shell" id="features">
        <h2>Built for how people actually watch.</h2>
        <p className="section-lead">The beta focuses on speed, resilient downloads, multiple sources and a cleaner mobile experience.</p>
        <div className="grid">
          <article className="card"><div className="icon">⌕</div><h3>Fast search</h3><p>Search movies and series across supported sources from one place.</p></article>
          <article className="card"><div className="icon">↓</div><h3>Managed downloads</h3><p>Download with progress tracking and recovery when your connection changes.</p></article>
          <article className="card"><div className="icon">▶</div><h3>Flexible playback</h3><p>Use the built-in player with additional compatibility support for difficult media.</p></article>
        </div>
      </section>
      <section className="section shell">
        <div className="beta-box">
          <div>
            <span className="eyebrow">Beta tester program</span>
            <h2 style={{marginTop:14}}>Your device can help us make TheNkiri better.</h2>
            <p className="section-lead">Register your device and preferred contact method. After joining, you get access to the latest beta APK and a tester ID for bug reports.</p>
          </div>
          <a className="btn btn-primary" href="/join">Become a tester</a>
        </div>
      </section>
    </main>
  );
}
