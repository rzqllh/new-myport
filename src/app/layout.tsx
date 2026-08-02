import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const ChatWidget = dynamic(() => import('@/components/chat-widget'), { ssr: false });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  
  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  
  const title = settings.general?.site_title || "Hafizh Rizqullah Prasetya";
  const tagline = settings.general?.tagline || "PMO · Designer · Developer";
  const desc = settings.seo?.meta_description || "Personal portfolio of Hafizh Rizqullah Prasetya";
  const ogImage = settings.seo?.og_image || "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hafizhrizqullah.vercel.app";

  return {
    title: {
      default: `${title} — ${tagline}`,
      template: `%s | ${title}`,
    },
    description: desc,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: title,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh] bg-background text-foreground font-sans flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
