import { createClient } from "@/lib/supabase/server";
import {
  EXPERIENCE_CASES,
  FEATURED_CASES,
  localize,
  localizeEvidence,
  type CaseExperience,
  type CaseProject,
  type EvidenceItem,
} from "@/lib/case-files";

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function localizedProject(project: CaseProject, locale: string): CaseProject {
  const result = localize(project, locale);
  return {
    ...result,
    evidence_items: localizeEvidence(result.evidence_items || [], locale),
  };
}

function localizedExperience(
  experience: CaseExperience,
  locale: string
): CaseExperience {
  const result = localize(experience, locale);
  return {
    ...result,
    evidence_items: localizeEvidence(result.evidence_items || [], locale),
  };
}

export async function getFeaturedCases(locale = "en") {
  if (!hasSupabaseConfig()) {
    return FEATURED_CASES.map((item) => localizedProject(item, locale));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, slug, title, description, description_id, role, category, tech_stack, featured, sort_order, status, context, decision, outcome, context_id, decision_id, outcome_id, evidence_items, cover_url, cover_public_id"
      )
      .eq("status", "published")
      .eq("featured", true)
      .order("sort_order")
      .limit(3);

    if (error || !data?.length) {
      return FEATURED_CASES.map((item) => localizedProject(item, locale));
    }

    return (data as CaseProject[]).map((item) =>
      localizedProject(
        { ...item, evidence_items: (item.evidence_items || []) as EvidenceItem[] },
        locale
      )
    );
  } catch {
    return FEATURED_CASES.map((item) => localizedProject(item, locale));
  }
}

export async function getAllProjects(locale = "en") {
  if (!hasSupabaseConfig()) {
    return FEATURED_CASES.map((item) => localizedProject(item, locale));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, slug, title, description, description_id, role, category, tech_stack, featured, sort_order, status, context, decision, outcome, context_id, decision_id, outcome_id, evidence_items, cover_url, cover_public_id"
      )
      .eq("status", "published")
      .order("sort_order");

    if (error || !data?.length) {
      return FEATURED_CASES.map((item) => localizedProject(item, locale));
    }

    return (data as CaseProject[]).map((item) => localizedProject(item, locale));
  } catch {
    return FEATURED_CASES.map((item) => localizedProject(item, locale));
  }
}

export async function getProjectCase(slug: string, locale = "en") {
  const fallback = FEATURED_CASES.find((item) => item.slug === slug);

  if (!hasSupabaseConfig()) {
    return fallback ? localizedProject(fallback, locale) : null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, slug, title, description, description_id, role, category, tech_stack, featured, sort_order, status, context, decision, outcome, context_id, decision_id, outcome_id, evidence_items, cover_url, cover_public_id, project_images(url, alt_text, sort_order)"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return fallback ? localizedProject(fallback, locale) : null;
    }

    return localizedProject(data as CaseProject, locale);
  } catch {
    return fallback ? localizedProject(fallback, locale) : null;
  }
}

export async function getExperienceCases(locale = "en") {
  if (!hasSupabaseConfig()) {
    return EXPERIENCE_CASES.map((item) => localizedExperience(item, locale));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experiences")
      .select(
        "id, company, role, description, description_id, start_date, end_date, is_current, sort_order, context, decision, outcome, context_id, decision_id, outcome_id, evidence_items"
      )
      .order("sort_order")
      .order("start_date", { ascending: false });

    if (error || !data?.length) {
      return EXPERIENCE_CASES.map((item) => localizedExperience(item, locale));
    }

    return (data as CaseExperience[]).map((item) =>
      localizedExperience(item, locale)
    );
  } catch {
    return EXPERIENCE_CASES.map((item) => localizedExperience(item, locale));
  }
}
