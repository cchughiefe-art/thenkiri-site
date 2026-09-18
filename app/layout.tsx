import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheNkiri — Android Beta",
  description: "Join TheNkiri beta, download the Android app and help us test it."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a className="brand" href="/"><span className="logo">N</span><span>TheNkiri</span></a>
            <div className="nav-links">
              <a className="hide-mobile" href="/#features">Features</a>
              <a className="hide-mobile" href="/report">Report a problem</a>
              <a className="btn btn-secondary" href="/join">Join beta</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="footer"><div className="shell">
          TheNkiri is currently in beta. Tester contact details are kept private and used only for beta communication and support.
        </div></footer>
      </body>
    </html>
  );
}
