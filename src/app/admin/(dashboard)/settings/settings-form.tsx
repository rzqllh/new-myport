"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────

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

interface HeroStatsSettings {
  client_satisfaction: string;
  on_time_delivery: string;
  teams_collaborated: string;
  years_experience: string;
  based_in: string;
}

interface SettingsFormProps {
  initialSettings: Record<string, Record<string, string>>;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const supabase = createClient();
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

  const [heroStats, setHeroStats] = useState<HeroStatsSettings>({
    client_satisfaction: initialSettings.hero_stats?.client_satisfaction ?? "100%",
    on_time_delivery: initialSettings.hero_stats?.on_time_delivery ?? "98%",
    teams_collaborated: initialSettings.hero_stats?.teams_collaborated ?? "15+",
    years_experience: initialSettings.hero_stats?.years_experience ?? "5+",
    based_in: initialSettings.hero_stats?.based_in ?? "Indonesia",
  });

  const [saving, setSaving] = useState(false);

  async function upsertKey(key: string, value: Record<string, string>) {
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (err) throw err;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await Promise.all([
        upsertKey("general", general as unknown as Record<string, string>),
        upsertKey("social", social as unknown as Record<string, string>),
        upsertKey("seo", seo as unknown as Record<string, string>),
        upsertKey("cv", cv as unknown as Record<string, string>),
        upsertKey("hero_stats", heroStats as unknown as Record<string, string>),
      ]);
      toast.success("Settings saved successfully.");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-0 max-w-2xl divide-y divide-border">
      {/* ── General ─────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0">
        <div>
          <h2 className="text-base font-semibold">General</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Basic site identity shown in the browser tab and page headers.</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="site_title">Site Title</Label>
            <Input
              id="site_title"
              value={general.site_title}
              onChange={(e) =>
                setGeneral((p) => ({ ...p, site_title: e.target.value }))
              }
              placeholder="Hafizh Rizqullah Prasetya"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={general.tagline}
              onChange={(e) =>
                setGeneral((p) => ({ ...p, tagline: e.target.value }))
              }
              placeholder="PMO · Designer · Developer"
            />
          </div>
        </div>
      </section>

      {/* ── Social ──────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0">
        <div>
          <h2 className="text-base font-semibold">Social Links</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Used in the footer and contact page.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { key: "github", label: "GitHub URL", placeholder: "https://github.com/…" },
              { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/…" },
              { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
              { key: "email", label: "Email Address", placeholder: "hello@example.com" },
            ] as Array<{ key: keyof SocialSettings; label: string; placeholder: string }>
          ).map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`social_${key}`}>{label}</Label>
              <Input
                id={`social_${key}`}
                value={social[key]}
                onChange={(e) =>
                  setSocial((p) => ({ ...p, [key]: e.target.value }))
                }
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0">
        <div>
          <h2 className="text-base font-semibold">SEO</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Default meta description and Open Graph image for pages without their own.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={seo.meta_description}
              onChange={(e) =>
                setSeo((p) => ({ ...p, meta_description: e.target.value }))
              }
              placeholder="A short summary of what you do and who you are (150–160 characters)."
              className="h-20 resize-none"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {seo.meta_description.length}/160 characters
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>OG Image</Label>
            <div className="max-w-md">
              <ImageUpload
                value={seo.og_image || undefined}
                folder="portfolio/seo"
                label="Upload OG Image"
                aspectRatio={1200 / 630}
                onUpload={(url) => setSeo((p) => ({ ...p, og_image: url }))}
                onRemove={() => setSeo((p) => ({ ...p, og_image: "" }))}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 1200×630 px
            </p>
          </div>
        </div>
      </section>

      {/* ── Hero Stats ──────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0">
        <div>
          <h2 className="text-base font-semibold">Hero Section Stats</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Dynamic numbers shown on the landing page hero section.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { key: "client_satisfaction", label: "Client Satisfaction", placeholder: "100%" },
              { key: "on_time_delivery", label: "On Time Delivery", placeholder: "98%" },
              { key: "teams_collaborated", label: "Teams Collaborated With", placeholder: "15+" },
              { key: "years_experience", label: "Years of Experience", placeholder: "5+" },
              { key: "based_in", label: "Based In", placeholder: "Indonesia" },
            ] as Array<{ key: keyof HeroStatsSettings; label: string; placeholder: string }>
          ).map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`hero_stats_${key}`}>{label}</Label>
              <Input
                id={`hero_stats_${key}`}
                value={heroStats[key]}
                onChange={(e) =>
                  setHeroStats((p) => ({ ...p, [key]: e.target.value }))
                }
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CV ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0">
        <div>
          <h2 className="text-base font-semibold">CV / Resume</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Direct link used in the hero CTA and contact page.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cv_url">CV Download URL</Label>
          <Input
            id="cv_url"
            value={cv.url}
            onChange={(e) => setCv({ url: e.target.value })}
            placeholder="https://drive.google.com/…"
          />
        </div>
      </section>

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
