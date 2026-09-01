import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

const FALLBACK_ARTICLES = [
  {
    id: "post-1",
    slug: "building-modular-windows-diagnostics",
    title: "Building Modular Windows Diagnostics with Python and WMI",
    excerpt: "Architecting a unified, state-aware performance and network troubleshooting toolkit with automated registry rollback snapshots.",
    tags: ["Python", "System Architecture", "CLI", "Windows"],
    published_at: "2024-06-15",
    content: "<p>Windows system administration, hardware performance monitoring, and network diagnosis often require dozens of fragmented CLI tools and PowerShell scripts that lack unified state awareness.</p><p>In developing <strong>Voltune</strong>, the objective was creating a modular Python engine interfacing with Win32 APIs and Windows Management Instrumentation (WMI). Before executing any performance tuning profile or component store cleanup, the system creates automated registry restore points, ensuring full state rollback safety.</p><p>Key principles implemented:</p><ul><li>Zero-dependency core CLI design.</li><li>Non-destructive, audit-first hardware probes.</li><li>Safe, automated registry snapshots prior to modifications.</li></ul>",
  },
  {
    id: "post-2",
    slug: "user-centered-design-mobile-banking",
    title: "Evaluating Banking Interfaces with User-Centered Design & A/B Testing",
    excerpt: "How quantitative usability metrics (SUS, Time-on-Task, Error Rates) inform navigation redesigns for high-volume consumer workflows.",
    tags: ["UI/UX", "User Research", "A/B Testing", "Fintech"],
    published_at: "2024-05-20",
    content: "<p>Mobile banking interfaces require low cognitive friction and high trust. In our quantitative usability research at Gunadarma University, we investigated user friction during balance disclosures, multi-tier fund transfers, and QR code payments.</p><p>By conducting structured A/B usability experiments with representative user cohorts and evaluating System Usability Scale (SUS) benchmarks, we evaluated interaction improvements and reduced user task friction across primary banking journeys.</p>",
  },
  {
    id: "post-3",
    slug: "token-driven-dark-mode-design-systems",
    title: "Designing Accessible Dark Themes with Semantic Color Tokens",
    excerpt: "Moving beyond inverted hex codes: creating WCAG AA compliant surface hierarchies and contrast tokens for technical interfaces.",
    tags: ["Design Systems", "CSS", "Accessibility", "Tailwind"],
    published_at: "2024-04-10",
    content: "<p>High-contrast dark interfaces require careful calibration beyond simply converting white backgrounds to pure black hex codes. Optical halation, insufficient border separation, and uncontrolled glow can severely reduce legibility.</p><p>By establishing semantic color tokens (surface-0, surface-1, surface-2, text-foreground, text-muted), interfaces maintain spatial depth and exceed WCAG AA contrast standards across both LCD and OLED panels.</p>",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug);
  const title = data?.title || fallback?.title || "Writing";
  const description = data?.excerpt || fallback?.excerpt || "";

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | Hafizh Rizqullah Prasetya`,
      description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: data?.published_at || fallback?.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hafizh Rizqullah Prasetya`,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: dbPost } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const post = dbPost || FALLBACK_ARTICLES.find((a) => a.slug === slug);

  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    datePublished: post.published_at || undefined,
    author: {
      "@type": "Person",
      name: "Hafizh Rizqullah Prasetya",
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Hafizh Rizqullah Prasetya",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-[800px] px-6 py-24 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
      >
        <ArrowLeft weight="bold" className="size-4" />
        <span>All writing</span>
      </Link>

      <header className="mb-12 space-y-4">
        {post.published_at && (
          <p className="text-xs font-mono text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-tight text-foreground">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-muted-foreground text-lg leading-relaxed pt-2">{post.excerpt}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.content && (
        <div
          className="prose prose-neutral dark:prose-invert max-w-none text-base md:text-lg leading-relaxed prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}

