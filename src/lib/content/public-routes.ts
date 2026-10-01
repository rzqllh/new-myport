import type { Locale } from "@/types/content";

export const PUBLIC_UI = {
  en: {
    skipToContent: "Skip to main content",
    navigation: "Navigation",
    profiles: "Profiles",
    email: "Email",
    switchLanguage: "Bahasa Indonesia",
    currentFocus: "Current focus",
    contact: "Contact",
    aboutBackground: "About my background",
    readCaseStudy: "Read case study",
    selected: "Selected",
    read: "Read",
    published: "Published",
    noWork: "No published Work is available yet.",
    noInsights: "No published Insights are available yet.",
    role: "Role",
    work: "Work",
    timeframe: "Timeframe",
    toolsTechnology: "Tools / technology",
    openLiveSite: "Open live site",
    viewRepository: "View repository",
    evidence: "Evidence",
    sourceDate: "Source date",
    source: "Source",
    additionalMaterial: "Additional material",
    nextWork: "Next work",
    readNext: "Read next",
    context: "Context",
    issue: "The issue",
    approach: "Approach",
    outcome: "Outcome",
    notesLessons: "Notes and lessons",
    workDetailPending:
      "This Work item currently contains a summary and project metadata. Additional case-study material has not been published.",
    relatedWork: "Related work",
    articleBodyPending: "The full article body has not been published yet.",
    currentRole: "Current focus",
    professionalThroughLine: "Professional through-line",
    experience: "Experience",
    capabilities: "Capabilities",
    capabilityNote:
      "Qualitative capability labels replace arbitrary proficiency percentages.",
    outsideWork: "Outside work",
    present: "Present",
    experiencePending: "Experience entries are being prepared.",
    capabilitiesPending: "Capability details are being prepared.",
    contactMessage: "Send a message",
    contactMessageHelp:
      "Include enough context to understand the subject, scope, or question.",
    location: "Location",
    availability: "Availability",
    resumeExperience: "Experience",
    selectedWork: "Selected work",
    workingApproach: "Working approach",
    printSavePdf: "Print / Save PDF",
    downloadFile: "Download file",
    translationUnavailable: "Translation unavailable",
    translationUnavailableBody:
      "This item is not published in Bahasa Indonesia yet.",
    viewEnglishVersion: "View English version",
    allWork: "Work",
    allInsights: "Insights",
    name: "Name",
    message: "Message",
    sending: "Sending…",
    sendMessage: "Send message",
    messageSent: "Message sent",
    messageSentBody: "Your message was submitted successfully.",
    messagePlaceholder: "Project, role, question, or relevant context",
    assistantOpen: "Open portfolio assistant",
    assistantTitle: "Portfolio assistant",
    assistantIntro:
      "Ask about published Work, experience, or capabilities. Answers are grounded in this portfolio.",
    assistantInput: "Ask about the portfolio…",
    assistantSend: "Send question",
    assistantClose: "Close portfolio assistant",
    assistantSources: "Sources",
    assistantError: "The assistant is temporarily unavailable.",
  },
  id: {
    skipToContent: "Lewati ke konten utama",
    navigation: "Navigasi",
    profiles: "Profil",
    email: "Email",
    switchLanguage: "English",
    currentFocus: "Fokus saat ini",
    contact: "Kontak",
    aboutBackground: "Tentang latar belakang saya",
    readCaseStudy: "Baca studi kasus",
    selected: "Pilihan",
    read: "Baca",
    published: "Terbit",
    noWork: "Belum ada Karya berbahasa Indonesia yang dipublikasikan.",
    noInsights: "Belum ada Insight berbahasa Indonesia yang dipublikasikan.",
    role: "Peran",
    work: "Karya",
    timeframe: "Periode",
    toolsTechnology: "Tools / teknologi",
    openLiveSite: "Buka situs",
    viewRepository: "Lihat repositori",
    evidence: "Bukti",
    sourceDate: "Tanggal sumber",
    source: "Sumber",
    additionalMaterial: "Materi tambahan",
    nextWork: "Karya berikutnya",
    readNext: "Baca berikutnya",
    context: "Konteks",
    issue: "Permasalahan",
    approach: "Pendekatan",
    outcome: "Hasil",
    notesLessons: "Catatan dan pembelajaran",
    workDetailPending:
      "Karya ini saat ini baru memuat ringkasan dan metadata proyek. Materi studi kasus tambahan belum dipublikasikan.",
    relatedWork: "Karya terkait",
    articleBodyPending: "Isi lengkap artikel belum dipublikasikan.",
    currentRole: "Fokus saat ini",
    professionalThroughLine: "Benang merah profesional",
    experience: "Pengalaman",
    capabilities: "Kapabilitas",
    capabilityNote:
      "Kapabilitas ditampilkan secara kualitatif tanpa persentase kemampuan yang arbitrer.",
    outsideWork: "Di luar pekerjaan",
    present: "Sekarang",
    experiencePending: "Pengalaman berbahasa Indonesia sedang disiapkan.",
    capabilitiesPending: "Detail kapabilitas berbahasa Indonesia sedang disiapkan.",
    contactMessage: "Kirim pesan",
    contactMessageHelp:
      "Sertakan konteks yang cukup agar topik, lingkup, atau pertanyaannya dapat dipahami.",
    location: "Lokasi",
    availability: "Ketersediaan",
    resumeExperience: "Pengalaman",
    selectedWork: "Pilihan karya",
    workingApproach: "Cara bekerja",
    printSavePdf: "Cetak / Simpan PDF",
    downloadFile: "Unduh file",
    translationUnavailable: "Terjemahan belum tersedia",
    translationUnavailableBody:
      "Konten ini belum dipublikasikan dalam Bahasa Indonesia.",
    viewEnglishVersion: "Lihat versi English",
    allWork: "Karya",
    allInsights: "Insight",
    name: "Nama",
    message: "Pesan",
    sending: "Mengirim…",
    sendMessage: "Kirim pesan",
    messageSent: "Pesan terkirim",
    messageSentBody: "Pesan Anda berhasil dikirim.",
    messagePlaceholder: "Proyek, peran, pertanyaan, atau konteks yang relevan",
    assistantOpen: "Buka asisten portofolio",
    assistantTitle: "Asisten portofolio",
    assistantIntro:
      "Tanyakan Karya, pengalaman, atau kapabilitas yang sudah dipublikasikan. Jawaban mengacu pada portofolio ini.",
    assistantInput: "Tanyakan tentang portofolio…",
    assistantSend: "Kirim pertanyaan",
    assistantClose: "Tutup asisten portofolio",
    assistantSources: "Sumber",
    assistantError: "Asisten sedang tidak tersedia.",
  },
} as const;

export function localeFromValue(value?: string): Locale {
  return value === "id" ? "id" : "en";
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/id" || pathname.startsWith("/id/") ? "id" : "en";
}

export function publicPath(locale: Locale, path: string) {
  if (locale === "en") return path;
  if (path === "/") return "/id";
  return `/id${path}`;
}

export function switchLocalePath(pathname: string) {
  const locale = localeFromPathname(pathname);

  if (locale === "id") {
    const englishPath = pathname.replace(/^\/id(?=\/|$)/, "");
    return englishPath || "/";
  }

  return pathname === "/" ? "/id" : `/id${pathname}`;
}

export function alternateLanguages(
  path: string,
  availability: { en?: boolean; id?: boolean } = { en: true, id: true }
) {
  const languages: Record<string, string> = {};

  if (availability.en !== false) {
    languages.en = path;
    languages["x-default"] = path;
  }

  if (availability.id !== false) {
    languages.id = publicPath("id", path);
  }

  return languages;
}
