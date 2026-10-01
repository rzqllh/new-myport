"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicContent } from "@/lib/content/revalidate-public-client";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GeneralSettings {
  site_title: string;
  tagline: string;
}

interface SocialSettings {
  github: string;
  linkedin: string;
  instagram: string;
  email: string;
}

interface SeoSettings {
  meta_description: string;
  og_image: string;
}

interface CvSettings {
  url: string;
}

interface ProfileSettings {
  location: string;
  availability: string;
}

interface SettingsFormProps {
  initialSettings: Record<string, Record<string, string>>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [general, setGeneral] = useState<GeneralSettings>({
    site_title: initialSettings.general?.site_title ?? "",
    tagline: initialSettings.general?.tagline ?? "",
  });
  const [social, setSocial] = useState<SocialSettings>({
    github: initialSettings.social?.github ?? "",
    linkedin: initialSettings.social?.linkedin ?? "",
    instagram: initialSettings.social?.instagram ?? "",
    email: initialSettings.social?.email ?? "",
  });
  const [seo, setSeo] = useState<SeoSettings>({
    meta_description: initialSettings.seo?.meta_description ?? "",
    og_image: initialSettings.seo?.og_image ?? "",
  });
  const [cv, setCv] = useState<CvSettings>({
    url: initialSettings.cv?.url ?? "",
  });
  const [profile, setProfile] = useState<ProfileSettings>({
    location: initialSettings.profile?.location ?? "Indonesia",
    availability: initialSettings.profile?.availability ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function upsertKey(key: string, value: Record<string, string>) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await Promise.all([
        upsertKey("general", general as unknown as Record<string, string>),
        upsertKey("social", social as unknown as Record<string, string>),
        upsertKey("seo", seo as unknown as Record<string, string>),
        upsertKey("cv", cv as unknown as Record<string, string>),
        upsertKey("profile", profile as unknown as Record<string, string>),
      ]);
      await revalidatePublicContent();
      toast.success("Settings saved.");
      router.refresh();
    } catch (caught: unknown) {
      toast.error(
        caught instanceof Error ? caught.message : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl divide-y divide-border"
    >
      <section className="space-y-5 pb-8">
        <div>
          <h2 className="text-base font-semibold">Site identity</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Operational identity and metadata. Public editorial statements belong in Site Content.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="site_title">Site title</Label>
            <Input
              id="site_title"
              value={general.site_title}
              onChange={(event) =>
                setGeneral((current) => ({
                  ...current,
                  site_title: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Metadata tagline</Label>
            <Input
              id="tagline"
              value={general.tagline}
              onChange={(event) =>
                setGeneral((current) => ({
                  ...current,
                  tagline: event.target.value,
                }))
              }
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 py-8">
        <div>
          <h2 className="text-base font-semibold">Profile & availability</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Shared factual information used by public navigation, contact, and profile surfaces.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-location">Location display</Label>
            <Input
              id="profile-location"
              value={profile.location}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-availability">Availability note</Label>
            <Input
              id="profile-availability"
              value={profile.availability}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  availability: event.target.value,
                }))
              }
              placeholder="Optional factual availability note"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 py-8">
        <div>
          <h2 className="text-base font-semibold">Profiles & contact</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            One source for public social links and direct email.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["github", "GitHub URL"],
              ["linkedin", "LinkedIn URL"],
              ["instagram", "Instagram URL"],
              ["email", "Email address"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`social-${key}`}>{label}</Label>
              <Input
                id={`social-${key}`}
                value={social[key]}
                onChange={(event) =>
                  setSocial((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 py-8">
        <div>
          <h2 className="text-base font-semibold">SEO defaults</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Used only when a page does not provide its own localized SEO fields.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta-description">Meta description</Label>
            <Textarea
              id="meta-description"
              value={seo.meta_description}
              onChange={(event) =>
                setSeo((current) => ({
                  ...current,
                  meta_description: event.target.value,
                }))
              }
              maxLength={160}
              className="min-h-24"
            />
            <p className="text-xs text-muted-foreground">
              {seo.meta_description.length}/160
            </p>
          </div>
          <div className="max-w-lg space-y-2">
            <Label>Default Open Graph image</Label>
            <ImageUpload
              value={seo.og_image || undefined}
              folder="portfolio/seo"
              label="Upload OG image"
              aspectRatio={1200 / 630}
              onUpload={(url) =>
                setSeo((current) => ({ ...current, og_image: url }))
              }
              onRemove={() =>
                setSeo((current) => ({ ...current, og_image: "" }))
              }
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 py-8">
        <div>
          <h2 className="text-base font-semibold">Resume</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Current public resume/CV destination.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cv-url">Resume URL</Label>
          <Input
            id="cv-url"
            value={cv.url}
            onChange={(event) => setCv({ url: event.target.value })}
          />
        </div>
      </section>

      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
