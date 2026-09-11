import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import NewsCard from "@/components/newsCard/NewsCard";
import {
    getNewsArticle,
    getNewsList,
    parseNewsSlug,
    NEWS_INDEXABLE,
    NEWS_SOURCE,
} from "@/lib/news";
import { abs, buildMetadata, jsonLd } from "@/lib/seo";
import { clamp, trDate } from "@/lib/format";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { id, sourceSlug } = parseNewsSlug(slug);
    const article = id && (await getNewsArticle(id, sourceSlug));

    if (!article) {
        return { title: "Haber bulunamadı", robots: { index: false } };
    }

    return buildMetadata({
        title: `${article.title} — Haber`,
        description: article.description || article.title,
        path: `/haberler/${article.slug}`,
        image: article.image || undefined,
        imageAlt: article.title,
        type: "article",
        publishedTime: article.date || undefined,
        // İçerik birebir kaynağın metni; yinelenen içerik olarak dizine girmesin.
        noIndex: !NEWS_INDEXABLE,
    });
}

export default async function NewsArticlePage({ params }) {
    const { slug } = await params;
    const { id, sourceSlug } = parseNewsSlug(slug);
    if (!id) notFound();

    const article = await getNewsArticle(id, sourceSlug);
    if (!article) notFound();

    // Yan sütundaki "diğer haberler" için ilk sayfa yeterli
    const { items } = await getNewsList(1);
    const others = items.filter((item) => item.id !== article.id).slice(0, 4);

    return (
        <div className="newsDetail pageShell">
            <ContentWrapper>
                <Breadcrumbs
                    items={[
                        { name: "Ana sayfa", href: "/" },
                        { name: "Haberler", href: "/haberler" },
                        { name: article.title },
                    ]}
                />

                <article className="newsArticle">
                    <header className="newsArticleHead">
                        <h1 className="newsArticleTitle">{article.title}</h1>
                        <div className="newsArticleMeta">
                            {article.date && (
                                <time dateTime={article.date}>
                                    {trDate(article.date) || article.dateText}
                                </time>
                            )}
                            <span className="badge">{NEWS_SOURCE.name}</span>
                        </div>
                    </header>

                    {article.image && (
                        <figure className="newsArticleFigure">
                            <Image
                                src={article.image}
                                alt={article.title}
                                width={1200}
                                height={675}
                                className="newsArticleImg"
                                sizes="(min-width: 1024px) 760px, 100vw"
                                priority
                            />
                        </figure>
                    )}

                    {/* Kaynaktan gelen gövde sıkı bir beyaz listeden geçirilir (lib/news.js) */}
                    <div
                        className="newsArticleBody"
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                    />

                    <footer className="newsArticleFoot">
                        <p>
                            Bu haber{" "}
                            <a
                                href={NEWS_SOURCE.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {NEWS_SOURCE.name}
                            </a>{" "}
                            kaynağından alınmıştır. Telif ve sorumluluk kaynağa aittir.
                        </p>
                        <a
                            href={article.sourceUrl}
                            className="btn btnGhost"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Haberin kaynağına git ↗
                        </a>
                    </footer>
                </article>

                {others.length > 0 && (
                    <section className="newsMore">
                        <div className="sectionHeading">
                            <h2>Diğer haberler</h2>
                            <Link href="/haberler" className="sectionLink">
                                Tümü →
                            </Link>
                        </div>
                        <div className="newsGrid">
                            {others.map((item) => (
                                <NewsCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}
            </ContentWrapper>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd({
                    "@context": "https://schema.org",
                    "@type": "NewsArticle",
                    headline: article.title,
                    description: clamp(article.description, 200) || article.title,
                    image: article.image ? [article.image] : undefined,
                    datePublished: article.date || undefined,
                    inLanguage: "tr-TR",
                    mainEntityOfPage: abs(`/haberler/${article.slug}`),
                    isBasedOn: article.sourceUrl,
                    publisher: {
                        "@type": "Organization",
                        name: NEWS_SOURCE.name,
                        url: NEWS_SOURCE.url,
                    },
                })}
            />
        </div>
    );
}
