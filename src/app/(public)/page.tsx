import { cookies } from "next/headers";
import { CaseIndex } from "@/components/case-file/case-index";
import { getExperienceCases, getFeaturedCases } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("portfolio_locale")?.value === "id" ? "id" : "en";
  const [projects, experiences] = await Promise.all([
    getFeaturedCases(locale),
    getExperienceCases(locale),
  ]);

  return <CaseIndex projects={projects} experiences={experiences} />;
}
