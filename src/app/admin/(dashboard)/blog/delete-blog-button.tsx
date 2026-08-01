"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";

export function DeleteBlogButton({ id }: { id: string }) {
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
    >
      <Trash weight="duotone" size={16} />
    </Button>
  );
}
