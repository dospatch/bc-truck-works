import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "BC TRUCK WORKS | ATS & ETS2",
  description: "BC TRUCK WORKS — connected trucking for American Truck Simulator and Euro Truck Simulator 2.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}