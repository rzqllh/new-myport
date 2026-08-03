import Link from "next/link";
import { ArrowLeft, Ghost } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background decorations */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"
        aria-hidden="true"
      />
      
      <ScrollReveal>
        <div className="space-y-8 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-sm font-medium text-muted-foreground mb-4">
            <Ghost weight="duotone" className="size-4" />
            <span>Error 404</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tighter text-foreground">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground max-w-[500px] mx-auto leading-relaxed">
              We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>
          
          <div className="pt-4">
            <Button size="lg" className="h-12 px-8 rounded-xl" render={<Link href="/" />} nativeButton={false}>
              <ArrowLeft weight="bold" className="mr-2" />
              Back to Homepage
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
