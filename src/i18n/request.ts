import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { messages, type PortfolioLocale } from "@/i18n/messages";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get("portfolio_locale")?.value;
  const locale: PortfolioLocale = storedLocale === "id" ? "id" : "en";

  return { locale, messages: messages[locale] };
});
