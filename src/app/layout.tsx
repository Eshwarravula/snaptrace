import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaperFix — Complex Paperwork, Solved.",
  description: "Like booking a cab, but for complex paperwork. Choose your issue, see verified experts, and book instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
