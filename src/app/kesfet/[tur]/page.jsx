import Link from "next/link";
import { notFound } from "next/navigation";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import MovieCard from "@/components/movieCard/MovieCard";
import Filters from "@/components/filters/Filters";
import BackdropCollage from "@/components/backdropCollage/BackdropCollage";
import { discover, getGenreMap, getGenres } from "@/lib/tmdb";
import { buildMetadata, itemListSchema, jsonLd } from "@/lib/seo";

export const revalidate = 3600;

const TYPES = {
    filmler: {
        media: "movie",
        title: "Filmler",
        h1: "Film keşfet",
        seoTitle: "Film Keşfet — Tür, Puan ve Yıla Göre Filmler",
        description:
            "Türlere, puana ve yıla göre film keşfet. İzlediklerini kaydet, puanla ve senin gibi izleyenlerin yorumlarını oku.",
    },
    diziler: {
        media: "tv",
        title: "Diziler",
        h1: "Dizi keşfet",
        seoTitle: "Dizi Keşfet — Tür, Puan ve Yıla Göre Diziler",
        description:
            "Türlere, puana ve yıla göre dizi keşfet. Bölüm bölüm tartışmalara katıl, izlediklerini günlüğüne kaydet.",
    },
};

export function generateStaticParams() {
    return [{ tur: "filmler" }, { tur: "diziler" }];
}

export async function generateMetadata({ params, searchParams }) {
    const { tur } = await params;
    const sp = await searchParams;
    const config = TYPES[tur];
    if (!config) return { title: "Sayfa bulunamadı", robots: { index: false } };

    const page = Number(sp?.sayfa) || 1;
    const filtered = Boolean(sp?.tur || sp?.sirala);

    return buildMetadata({
        title: page > 1 ? `${config.seoTitle} — ${page}. sayfa` : config.seoTitle,
        description: config.description,
        // Filtrelenmiş görünümler ince/yinelenen içerik üretir; dizine girmesin.
        // Sayfalanmış listeler ise kendi canonical'ıyla dizine girer.
        path: filtered
            ? `/kesfet/${tur}`
            : `/kesfet/${tur}${page > 1 ? `?sayfa=${page}` : ""}`,
        noIndex: filtered,
    });
}

export default async function ExplorePage({ params, searchParams }) {
    const { tur } = await params;
    const sp = await searchParams;
    const config = TYPES[tur];
    if (!config) notFound();

    const page = Math.max(1, Math.min(Number(sp?.sayfa) || 1, 500));
    const genreId = sp?.tur || "";
    const sortBy = sp?.sirala || "popularity.desc";

    const [data, genreList, genreMap] = await Promise.all([
        discover(config.media, {
            page: String(page),
            sort_by: sortBy,
            "vote_count.gte": "50",
            ...(genreId ? { with_genres: genreId } : {}),
        }),
        getGenres(config.media),
        getGenreMap(),
    ]);

    const results = data?.results || [];
    const totalPages = Math.min(data?.total_pages || 1, 500);
    const activeGenreName = genreList?.genres?.find(
        (g) => String(g.id) === String(genreId)
    )?.name;

    const pageHref = (n) => {
        const qs = new URLSearchParams();
        if (genreId) qs.set("tur", genreId);
        if (sp?.sirala) qs.set("sirala", sortBy);
        if (n > 1) qs.set("sayfa", String(n));
        const s = qs.toString();
        return s ? `/kesfet/${tur}?${s}` : `/kesfet/${tur}`;
    };

    return (
        <div className="explorePage">
            <header className="pageHero hasCollage">
                <BackdropCollage items={results} variant="row" />
                <ContentWrapper>
                    <Breadcrumbs
                        items={[
                            { name: "Ana sayfa", href: "/" },
                            { name: "Keşfet", href: "/kesfet/filmler" },
                            { name: config.title },
                        ]}
                    />

                    <div className="explorePageHead">
                        <div>
                            <h1 className="pageTitle">
                                {activeGenreName
                                    ? `${activeGenreName} ${
                                          config.media === "movie" ? "filmleri" : "dizileri"
                                      }`
                                    : config.h1}
                            </h1>
                            <p className="lead">{config.description}</p>
                        </div>
                        <Filters genres={genreList?.genres || []} />
                    </div>
                </ContentWrapper>
            </header>

            <ContentWrapper>
                {results.length ? (
                    <>
                        <div className="grid">
                            {results.map((item, i) => (
                                <MovieCard
                                    key={item.id}
                                    data={item}
                                    mediaType={config.media}
                                    genreMap={genreMap}
                                    priority={i < 5}
                                />
                            ))}
                        </div>

                        {/* Sayfalama gerçek bağlantılarla: sonsuz kaydırmanın aksine
                            arama motorları tüm katalogu gezebilir. */}
                        {totalPages > 1 && (
                            <nav className="pagination" aria-label="Sayfalar">
                                {page > 1 && (
                                    <Link href={pageHref(page - 1)} className="btn btnGhost">
                                        ← Önceki
                                    </Link>
                                )}
                                <span className="paginationInfo">
                                    {page} / {totalPages}
                                </span>
                                {page < totalPages && (
                                    <Link href={pageHref(page + 1)} className="btn btnGhost">
                                        Sonraki →
                                    </Link>
                                )}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="emptyState">
                        <div className="emoji" aria-hidden="true">
                            🔍
                        </div>
                        <p className="title">Bu filtreyle bir şey çıkmadı.</p>
                        <p>Türü değiştirip yeniden dener misin?</p>
                        <Link href={`/kesfet/${tur}`} className="btn btnPrimary">
                            Filtreleri temizle
                        </Link>
                    </div>
                )}
            </ContentWrapper>
            <div className="explorePageFoot" />

            {results.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={jsonLd(
                        itemListSchema(results, {
                            name: config.h1,
                            mediaType: config.media,
                            path: pageHref(page),
                        })
                    )}
                />
            )}
        </div>
    );
}
