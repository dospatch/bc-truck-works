import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = { title: "BC TRUCK WORKS", description: "ATS / ETS2 trucking platform" };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
