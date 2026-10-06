import "./globals.css";
import "./platform.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "BC TRUCK WORKS | ATS & ETS2",
  description:
    "BC TRUCK WORKS — connected trucking for American Truck Simulator and Euro Truck Simulator 2.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));',
          }}
        />
      </body>
    </html>
  );
}
