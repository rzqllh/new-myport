import type { Metadata } from "next";
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Hafizh Rizqullah Prasetya — PMO · Designer · Developer",
    template: "%s | Hafizh Rizqullah Prasetya",
  },
  description:
    "Personal portfolio of Hafizh Rizqullah Prasetya — a hybrid Project Management Officer, UI/UX Designer, and Web Developer based in Indonesia.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hafizhrizqullah.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hafizh Rizqullah Prasetya",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
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
          <Navbar />
          <PageTransition>
            <main className="flex-1 pt-[72px]">{children}</main>
          </PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
