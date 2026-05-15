import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "PaperFix - Government Certificates Delivered From Home", description: "PaperFix helps you apply, track, and receive government certificates digitally from home." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
