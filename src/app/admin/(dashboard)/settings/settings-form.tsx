"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GeneralSettings {
  site_title: string;
  tagline: string;
}

interface SocialSettings {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

interface SeoSettings {
  meta_description: string;
  og_image: string;
}

interface CvSettings {
  url: string;
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
    twitter: initialSettings.social?.twitter ?? "",
    email: initialSettings.social?.email ?? "",
  });

  const [seo, setSeo] = useState<SeoSettings>({
    meta_description: initialSettings.seo?.meta_description ?? "",
    og_image: initialSettings.seo?.og_image ?? "",
  });

  const [cv, setCv] = useState<CvSettings>({
    url: initialSettings.cv?.url ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function upsertKey(key: string, value: Record<string, string>) {
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (err) throw err;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await Promise.all([
        upsertKey("general", general as unknown as Record<string, string>),
        upsertKey("social", social as unknown as Record<string, string>),
        upsertKey("seo", seo as unknown as Record<string, string>),
        upsertKey("cv", cv as unknown as Record<string, string>),
      ]);
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  // ── Section wrapper ────────────────────────────────────────────────────────
  function Section({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) {
    return (
      <section className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {children}
      </section>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-0 max-w-2xl divide-y divide-border">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm mb-6">
          Settings saved successfully.
        </div>
      )}

      {/* ── General ─────────────────────────────────────────────────────── */}
      <Section
        title="General"
        description="Basic site identity shown in the browser tab and page headers."
      >
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
      </Section>

      {/* ── Social ──────────────────────────────────────────────────────── */}
      <Section
        title="Social Links"
        description="Used in the footer and contact page."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { key: "github", label: "GitHub URL", placeholder: "https://github.com/…" },
              { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/…" },
              { key: "twitter", label: "Twitter / X URL", placeholder: "https://x.com/…" },
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
      </Section>

      {/* ── SEO ─────────────────────────────────────────────────────────── */}
      <Section
        title="SEO"
        description="Default meta description and Open Graph image for pages without their own."
      >
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
            <Label htmlFor="og_image">OG Image URL</Label>
            <Input
              id="og_image"
              value={seo.og_image}
              onChange={(e) =>
                setSeo((p) => ({ ...p, og_image: e.target.value }))
              }
              placeholder="https://res.cloudinary.com/…/og-default.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 1200×630 px
            </p>
          </div>
        </div>
      </Section>

      {/* ── CV ──────────────────────────────────────────────────────────── */}
      <Section
        title="CV / Resume"
        description="Direct link used in the hero CTA and contact page."
      >
        <div className="space-y-1.5">
          <Label htmlFor="cv_url">CV Download URL</Label>
          <Input
            id="cv_url"
            value={cv.url}
            onChange={(e) => setCv({ url: e.target.value })}
            placeholder="https://drive.google.com/…"
          />
        </div>
      </Section>

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
