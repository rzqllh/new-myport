import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-border bg-background md:flex md:flex-col">
      <div className="border-b border-border px-6 py-5">
        <Link href="/admin" className="block">
          <span className="block text-sm font-semibold tracking-tight text-foreground">
            Portfolio Studio
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Content & publishing
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <AdminNavigation />
      </div>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-10 items-center justify-between rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span>Open public site</span>
          <ArrowSquareOut className="size-4" />
        </Link>
      </div>
    </aside>
  );
}
