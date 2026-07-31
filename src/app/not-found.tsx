import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6">
        <h1 className="font-display font-bold text-7xl md:text-9xl text-primary/20 tracking-tighter select-none">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
          Page not found
        </h2>
        <p className="text-muted-foreground max-w-[40ch] mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or is
          temporarily unavailable.
        </p>
        <Button size="lg" render={<Link href="/" />} nativeButton={false}>
          <ArrowLeft weight="bold" data-icon="inline-start" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
