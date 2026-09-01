import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring font-medium text-sm"
      >
        Skip to main content
      </a>
      <Navbar />
      <PageTransition>
        <main id="main-content" tabIndex={-1} className="flex-1 pt-[72px] focus:outline-none">
          {children}
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
