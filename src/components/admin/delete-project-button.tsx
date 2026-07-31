"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/client";

interface DeleteProjectButtonProps {
  id: string;
}

export function DeleteProjectButton({ id }: DeleteProjectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setIsDeleting(true);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    
    setIsDeleting(false);
    if (!error) {
      router.refresh();
    } else {
      alert("Error deleting project.");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash weight="duotone" className="size-4" />
    </Button>
  );
}
