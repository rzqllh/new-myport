"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isIndonesian = pathname === "/id" || pathname.startsWith("/id/");

  return (
    <div
      role="alert"
      className="editorial-container flex min-h-[55vh] max-w-3xl flex-col justify-center py-20"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {isIndonesian ? "Halaman tidak dapat dimuat" : "Page unavailable"}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {isIndonesian
          ? "Konten ini sedang tidak dapat ditampilkan."
          : "This content is temporarily unavailable."}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        {isIndonesian
          ? "Coba muat ulang halaman. Jika layanan data sedang bermasalah, navigasi utama tetap dapat digunakan."
          : "Try loading the page again. If the content service is having an issue, the rest of the portfolio remains available."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          {isIndonesian ? "Coba lagi" : "Try again"}
        </Button>
        <Button
          variant="outline"
          render={<a href={isIndonesian ? "/id" : "/"} />}
          nativeButton={false}
        >
          {isIndonesian ? "Kembali ke beranda" : "Return home"}
        </Button>
      </div>
    </div>
  );
}
