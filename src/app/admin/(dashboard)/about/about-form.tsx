"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/client";

interface AboutData {
  id: string;
  bio: string | null;
  philosophy: string | null;
  hobbies: string | null;
  photo_url: string | null;
}

interface AboutFormProps {
  initialData: AboutData | null;
}

export function AboutForm({ initialData }: AboutFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [philosophy, setPhilosophy] = useState(initialData?.philosophy ?? "");
  const [hobbies, setHobbies] = useState(initialData?.hobbies ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      bio: bio || null,
      philosophy: philosophy || null,
      hobbies: hobbies || null,
      photo_url: photoUrl || null,
    };

    let err;
    if (initialData?.id) {
      ({ error: err } = await supabase
        .from("about")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      ({ error: err } = await supabase.from("about").insert(payload));
    }

    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm">
          Changes saved successfully.
        </div>
      )}

      {/* Photo */}
      <div className="space-y-3">
        <div>
          <Label>Profile Photo</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Displayed on the About page and previews.
          </p>
        </div>
        <div className="max-w-xs">
          <ImageUpload
            value={photoUrl || undefined}
            folder="portfolio/about"
            label="Upload photo"
            onUpload={(url) => setPhotoUrl(url)}
            onRemove={() => setPhotoUrl("")}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <p className="text-xs text-muted-foreground">
          Main biography paragraph shown prominently on the About page.
        </p>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A few sentences about who you are and what you do..."
          className="h-36 resize-none"
        />
      </div>

      {/* Philosophy */}
      <div className="space-y-2">
        <Label htmlFor="philosophy">Philosophy / Approach</Label>
        <p className="text-xs text-muted-foreground">
          Your working philosophy, values, or design approach.
        </p>
        <Textarea
          id="philosophy"
          value={philosophy}
          onChange={(e) => setPhilosophy(e.target.value)}
          placeholder="How you think about work, design, or code..."
          className="h-28 resize-none"
        />
      </div>

      {/* Hobbies */}
      <div className="space-y-2">
        <Label htmlFor="hobbies">Hobbies & Interests</Label>
        <p className="text-xs text-muted-foreground">
          Brief section about life outside work.
        </p>
        <Textarea
          id="hobbies"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="What you enjoy outside of work..."
          className="h-24 resize-none"
        />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
