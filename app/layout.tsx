import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxFlow - CA/GST Firm Operating System",
  description: "TaxFlow helps Indian CA and GST firms manage clients, GST work, documents, staff tasks, reminders, and payments from one dashboard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
