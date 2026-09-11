import Link from "next/link";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import NewsCard from "@/components/newsCard/NewsCard";
import { getNewsList, NEWS_SOURCE } from "@/lib/news";
import { abs, buildMetadata, jsonLd } from "@/lib/seo";

export const revalidate = 900;

const TITLE = "Sinema ve Dizi Haberleri";
const DESCRIPTION =
    "Sinema ve dizi dünyasından güncel haberler: yeni projeler, kadro duyuruları, fragmanlar ve vizyon takvimi.";

export async function generateMetadata({ searchParams }) {
    const sp = await searchParams;
    const page = Number(sp?.sayfa) || 1;

    return buildMetadata({
        title: page > 1 ? `${TITLE} — ${page}. sayfa` : TITLE,
        description: DESCRIPTION,
        path: `/haberler${page > 1 ? `?sayfa=${page}` : ""}`,
    });
}

export default async function NewsPage({ searchParams }) {
    const sp = await searchParams;
    const page = Math.max(1, Number(sp?.sayfa) || 1);
    const { items, hasNext } = await getNewsList(page);

    const pageHref = (n) => (n > 1 ? `/haberler?sayfa=${n}` : "/haberler");
    const [lead, ...rest] = items;

    return (
        <div className="newsPage pageShell">
            <ContentWrapper>
                <Breadcrumbs
                    items={[{ name: "Ana sayfa", href: "/" }, { name: "Haberler" }]}
                />

                <header className="newsHead">
                    <h1 className="pageTitle">Haberler</h1>
                    <p className="lead">{DESCRIPTION}</p>
                    <p className="newsSourceNote">
                        Haberler{" "}
                        <a
                            href={NEWS_SOURCE.url + NEWS_SOURCE.listPath}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {NEWS_SOURCE.name}
                        </a>{" "}
                        kaynağından alınmaktadır.
                    </p>
                </header>

                {items.length ? (
                    <>
                        <div className="newsList">
                            {page === 1 && lead && (
                                <NewsCard item={lead} featured priority />
                            )}
                            <div className="newsGrid">
                                {(page === 1 ? rest : items).map((item, i) => (
                                    <NewsCard
                                        key={item.id}
                                        item={item}
                                        priority={page === 1 ? false : i < 3}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Gerçek bağlantılarla sayfalama — sonsuz kaydırma yok */}
                        <nav className="pagination" aria-label="Sayfalar">
                            {page > 1 && (
                                <Link href={pageHref(page - 1)} className="btn btnGhost">
                                    ← Önceki
                                </Link>
                            )}
                            <span className="paginationInfo">{page}. sayfa</span>
                            {hasNext && (
                                <Link href={pageHref(page + 1)} className="btn btnGhost">
                                    Sonraki →
                                </Link>
                            )}
                        </nav>
                    </>
                ) : (
                    <div className="emptyState">
                        <div className="emoji" aria-hidden="true">
                            📰
                        </div>
                        <p className="title">Haberler şu an yüklenemedi.</p>
                        <p>Kaynağa ulaşılamıyor olabilir; birazdan tekrar dene.</p>
                        <Link href="/haberler" className="btn btnPrimary">
                            Yeniden dene
                        </Link>
                    </div>
                )}
            </ContentWrapper>

            {items.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={jsonLd({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: TITLE,
                        description: DESCRIPTION,
                        url: abs(pageHref(page)),
                        inLanguage: "tr-TR",
                        hasPart: items.slice(0, 20).map((item) => ({
                            "@type": "NewsArticle",
                            headline: item.title,
                            url: abs(`/haberler/${item.slug}`),
                            datePublished: item.date || undefined,
                            image: item.image || undefined,
                        })),
                    })}
                />
            )}
        </div>
    );
}
