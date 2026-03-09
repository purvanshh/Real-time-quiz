import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Application",
  description: "Build by Rajendra Patel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var e=localStorage.getItem("theme"),r=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",e==="dark"||(!e&&r))})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
