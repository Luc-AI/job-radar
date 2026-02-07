import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Radar",
  description: "Track and manage your job applications in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
