import Link from "next/link";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import SearchBox from "@/components/searchBox/SearchBox";
import MovieCard from "@/components/movieCard/MovieCard";
import { getGenreMap, search } from "@/lib/tmdb";
import { buildMetadata } from "@/lib/seo";
import { count } from "@/lib/format";

export const revalidate = 600;

export async function generateMetadata({ searchParams }) {
    const sp = await searchParams;
    const q = (sp?.q || "").trim();

    return buildMetadata({
        title: q ? `“${q}” için arama sonuçları` : "Film ve dizi ara",
        description: q
            ? `${q} ile ilgili film ve diziler, puanlar ve izleyici yorumları.`
            : "Ne İzledin? üzerinde film ve dizi ara. İzlediklerini kaydet, puanla, yorumla.",
        path: "/ara",
        // Arama sonuç sayfaları dizine alınmaz — sonsuz sayıda ince sayfa üretir.
        // Bağlantılar yine de taranır, böylece detay sayfalarına link akışı sürer.
        noIndex: true,
    });
}

export default async function SearchPage({ searchParams }) {
    const sp = await searchParams;
    const q = (sp?.q || "").trim();
    const page = Math.max(1, Number(sp?.sayfa) || 1);

    if (!q) {
        return (
            <div className="pageShell searchPage">
                <ContentWrapper>
                    <div className="searchHead">
                        <h1 className="pageTitle">
                            Ne arıyorsun<span className="q">?</span>
                        </h1>
                        <p className="lead">
                            Film ya da dizi adı yaz, gerisini biz halledelim.
                        </p>
                        <SearchBox autoFocus />
                    </div>
                </ContentWrapper>
            </div>
        );
    }

    const [data, genreMap] = await Promise.all([search(q, page), getGenreMap()]);
    const results = (data?.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    const totalPages = Math.min(data?.total_pages || 1, 500);

    const pageHref = (n) =>
        `/ara?q=${encodeURIComponent(q)}${n > 1 ? `&sayfa=${n}` : ""}`;

    return (
        <div className="pageShell searchPage">
            <ContentWrapper>
                <div className="searchHead">
                    <h1 className="pageTitle">“{q}” için sonuçlar</h1>
                    <SearchBox defaultValue={q} />
                </div>

                {results.length ? (
                    <>
                        <p className="searchCount">
                            {count(data.total_results)} sonuç bulundu.
                        </p>

                        <div className="grid">
                            {results.map((item, i) => (
                                <MovieCard
                                    key={`${item.media_type}-${item.id}`}
                                    data={item}
                                    genreMap={genreMap}
                                    priority={i < 5}
                                />
                            ))}
                        </div>

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
                            🎬
                        </div>
                        <p className="title">Bunu bulamadık.</p>
                        <p>
                            Adını başka türlü yazmayı ya da orijinal adıyla aramayı dener
                            misin?
                        </p>
                        <Link href="/kesfet/filmler" className="btn btnPrimary">
                            Filmleri keşfet
                        </Link>
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
}
