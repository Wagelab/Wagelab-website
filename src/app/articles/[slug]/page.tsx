import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://www.wagelab.co.uk/articles/${slug}` },
    openGraph: {
      title: `${article.title} – WageLab`,
      description: article.description,
      type: "article",
      url: `https://www.wagelab.co.uk/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6" style={{ fontSize: 13, color: "#64748B" }}>
        <Link href="/" style={{ color: "#3B82F6" }}>Home</Link>
        {" · "}
        <Link href="/articles" style={{ color: "#3B82F6" }}>Articles</Link>
        {" · "}
        <span>{article.title}</span>
      </nav>

      {/* Article header */}
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "#3B82F6",
          textTransform: "uppercase",
          marginBottom: 10,
          fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          fontWeight: 600,
        }}
      >
        {article.category}
      </p>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#0F3460",
          marginBottom: 12,
          lineHeight: 1.3,
          fontFamily: "var(--font-dm-sans), Arial, sans-serif",
        }}
      >
        {article.title}
      </h1>
      <div
        className="flex items-center gap-4 mb-8"
        style={{ fontSize: 13, color: "#64748B" }}
      >
        <span>{article.readTime}</span>
        {article.date && <span>{new Date(article.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</span>}
      </div>

      <hr style={{ borderColor: "#E2E8F0", marginBottom: 32 }} />

      {/* Article body */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* CTA */}
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 10,
          padding: "20px 24px",
          marginTop: 40,
        }}
      >
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#0F3460",
            marginBottom: 8,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
          }}
        >
          Calculate your take-home pay
        </p>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
          Use the free WageLab calculator to see how these rules apply to your
          specific income and circumstances.
        </p>
        <Link
          href="/calculator"
          style={{
            background: "#FF00FF",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 13,
            padding: "10px 22px",
            borderRadius: 20,
            fontFamily: "var(--font-dm-sans), Arial, sans-serif",
            display: "inline-block",
          }}
        >
          Try the calculator →
        </Link>
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/articles"
          style={{ color: "#3B82F6", fontSize: 13, fontWeight: 500 }}
        >
          ← All articles
        </Link>
      </div>
    </div>
  );
}
