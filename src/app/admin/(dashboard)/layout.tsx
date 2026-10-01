import { Toaster } from "sonner";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AdminSidebar />
      <div className="min-h-dvh md:pl-[272px]">
        <AdminHeader />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-8 lg:px-10">
          {children}
        </main>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
