import { createClient } from "@/lib/supabase/server";
import { isV2SchemaUnavailable } from "@/lib/content/schema-compat";
import { ExperienceClient, type ExperienceEditorItem } from "./experience-client";

export const metadata = {
  title: "Experience — Admin",
};

export default async function ExperienceAdminPage() {
  const supabase = await createClient();

  const [{ data: experiences, error }, translationResult] = await Promise.all([
    supabase
      .from("experiences")
      .select("id, company, role, description, start_date, end_date, is_current, sort_order")
      .order("sort_order")
      .order("start_date", { ascending: false }),
    supabase
      .from("experience_translations")
      .select("experience_id, locale, role, description"),
  ]);

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Failed to load experiences: {error.message}
      </div>
    );
  }

  const schemaV2Available = !translationResult.error;
  if (
    translationResult.error &&
    !isV2SchemaUnavailable(translationResult.error)
  ) {
    return (
      <div className="text-sm text-destructive">
        Failed to load localized experience: {translationResult.error.message}
      </div>
    );
  }

  const translations = translationResult.data ?? [];
  const initialItems: ExperienceEditorItem[] = (experiences ?? []).map((item) => {
    const en = translations.find(
      (copy) => copy.experience_id === item.id && copy.locale === "en"
    );
    const id = translations.find(
      (copy) => copy.experience_id === item.id && copy.locale === "id"
    );

    return {
      id: item.id,
      company: item.company,
      start_date: item.start_date,
      end_date: item.end_date,
      is_current: item.is_current,
      sort_order: item.sort_order,
      en_role: en?.role ?? item.role,
      en_description: en?.description ?? item.description ?? "",
      id_role: id?.role ?? "",
      id_description: id?.description ?? "",
    };
  });

  return (
    <ExperienceClient
      initialItems={initialItems}
      schemaV2Available={schemaV2Available}
    />
  );
}
