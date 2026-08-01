import { createClient } from "@/lib/supabase/server";
import { TestimonialsClient } from "./testimonials-client";

export const metadata = { title: "Testimonials — Admin" };

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  if (error) {
    return <div className="text-destructive text-sm">Failed to load: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Testimonials</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage quotes shown on the homepage.
        </p>
      </div>
      <TestimonialsClient initialItems={data ?? []} />
    </div>
  );
}
