import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "SHLOKA-AFI | Sanskrit & Ayurvedic Knowledge Intelligence",
  description: "Transforming Sanskrit texts, shlokas, and Ayurvedic treatises into structured, ontology-aligned, machine-readable knowledge graph assets using AI.",
  keywords: ["Sanskrit AI", "Ayurveda Intelligence", "Knowledge Graph", "Ontology Alignment", "NLP", "Vedic Science"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-gold-500/30">
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
