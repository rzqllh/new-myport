import { createClient } from "@/lib/supabase/server";
import { isV2SchemaUnavailable } from "@/lib/content/schema-compat";
import {
  CapabilitiesClient,
  type CapabilityEditorItem,
} from "./skills-client";

export const metadata = {
  title: "Capabilities — Admin",
};

function legacyCategory(category: string) {
  if (category === "design") return "research-design";
  if (category === "tools") return "tools";
  return "engineering";
}

export default async function CapabilitiesAdminPage() {
  const supabase = await createClient();

  const capabilityResult = await supabase
    .from("capabilities")
    .select("id, key, category, level, sort_order, is_visible")
    .order("sort_order");

  if (capabilityResult.error) {
    if (!isV2SchemaUnavailable(capabilityResult.error)) {
      return (
        <div className="text-sm text-destructive">
          Failed to load capabilities: {capabilityResult.error.message}
        </div>
      );
    }

    const { data: legacySkills, error: legacyError } = await supabase
      .from("skills")
      .select("id, name, category, sort_order")
      .order("sort_order");

    if (legacyError) {
      return (
        <div className="text-sm text-destructive">
          Failed to load legacy skills: {legacyError.message}
        </div>
      );
    }

    const items: CapabilityEditorItem[] = (legacySkills ?? []).map((item) => ({
      id: item.id,
      key: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      category: legacyCategory(item.category),
      level: "working",
      sort_order: item.sort_order,
      is_visible: true,
      en_name: item.name,
      en_description: "",
      id_name: "",
      id_description: "",
    }));

    return (
      <CapabilitiesClient
        initialItems={items}
        schemaV2Available={false}
      />
    );
  }

  const ids = (capabilityResult.data ?? []).map((item) => item.id);
  const translationResult = ids.length
    ? await supabase
        .from("capability_translations")
        .select("capability_id, locale, name, description")
        .in("capability_id", ids)
    : { data: [], error: null };

  if (translationResult.error) {
    return (
      <div className="text-sm text-destructive">
        Failed to load capability translations: {translationResult.error.message}
      </div>
    );
  }

  const translations = translationResult.data ?? [];
  const items: CapabilityEditorItem[] = (capabilityResult.data ?? []).map(
    (item) => {
      const en = translations.find(
        (copy) => copy.capability_id === item.id && copy.locale === "en"
      );
      const id = translations.find(
        (copy) => copy.capability_id === item.id && copy.locale === "id"
      );

      return {
        id: item.id,
        key: item.key,
        category: item.category,
        level: item.level,
        sort_order: item.sort_order,
        is_visible: item.is_visible,
        en_name: en?.name ?? item.key,
        en_description: en?.description ?? "",
        id_name: id?.name ?? "",
        id_description: id?.description ?? "",
      };
    }
  );

  return <CapabilitiesClient initialItems={items} schemaV2Available />;
}
