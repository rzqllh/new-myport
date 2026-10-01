"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicContent } from "@/lib/content/revalidate-public-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";

interface AboutMedia {
  id: string;
  photo_url: string | null;
}

export function AboutForm({ initialData }: { initialData: AboutMedia | null }) {
  const supabase = createClient();
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const payload = { photo_url: photoUrl || null };
    const result = initialData?.id
      ? await supabase.from("about").update(payload).eq("id", initialData.id)
      : await supabase.from("about").insert(payload);

    if (result.error) {
      toast.error(result.error.message);
      setSaving(false);
      return;
    }

    await revalidatePublicContent();
    toast.success("Profile media saved.");
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Profile"
        description="Profile media is operational data. Public About narrative is authored bilingually in Site Content."
        action={
          <Button
            variant="outline"
            render={<Link href="/admin/site-content" />}
            nativeButton={false}
          >
            Edit About copy
            <ArrowRight className="size-4" />
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-7">
        <div className="space-y-3">
          <div>
            <Label>Profile photo</Label>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Shared across locales. Biography, working approach, and outside-work copy belong to About · Profile in Site Content.
            </p>
          </div>
          <div className="max-w-xs">
            <ImageUpload
              value={photoUrl || undefined}
              folder="portfolio/about"
              label="Upload photo"
              aspectRatio={4 / 5}
              onUpload={(url) => setPhotoUrl(url)}
              onRemove={() => setPhotoUrl("")}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save profile media"}
          </Button>
        </div>
      </form>
    </div>
  );
}
