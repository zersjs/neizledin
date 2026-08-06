import Link from "next/link";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Carousel from "@/components/carousel/Carousel";
import BackdropCollage from "@/components/backdropCollage/BackdropCollage";
import { getGenreMap, getTopRated, getUpcoming } from "@/lib/tmdb";
import { buildMetadata, itemListSchema, jsonLd } from "@/lib/seo";

export const revalidate = 21600;

export const metadata = buildMetadata({
    title: "Listeler — Editör seçkileri ve topluluk listeleri",
    description:
        "Tek oturuşta bitenler, finali tartışılanlar, yeniden izlenmeye değerler… Ne İzledin? editör seçkileri ve topluluk listeleri.",
    path: "/listeler",
});

const LISTS = [
    {
        slug: "tek-oturusta-bitenler",
        name: "Tek oturuşta bitenler",
        curator: "Elif",
        count: 12,
        description:
            "Başladığın gece biten diziler. Ertesi sabah pişman olursun ama değer.",
    },
    {
        slug: "finali-tartisilanlar",
        name: "Finali hâlâ tartışılanlar",
        curator: "Editör",
        count: 18,
        description:
            "Bitişi yüzünden yıllardır konuşulan yapımlar. Spoilerlı alan burada çok kalabalık.",
    },
    {
        slug: "ikinci-izleyiste-acilanlar",
        name: "İkinci izleyişte açılanlar",
        curator: "Editör",
        count: 9,
        description:
            "İlk seferde kaçırdığın her şeyin ikinci seferde yerine oturduğu filmler.",
    },
    {
        slug: "turk-sinemasi-modern",
        name: "Modern Türk sineması",
        curator: "Editör",
        count: 15,
        description: "Son yirmi yılın konuşulmayı hak eden Türk filmleri.",
    },
    {
        slug: "gece-yarisi-gerilim",
        name: "Gece yarısı gerilimleri",
        curator: "Resul",
        count: 21,
        description: "Uyku düzenini bozmaya kararlı bir seçki.",
    },
    {
        slug: "ilk-bolumu-atlamayin",
        name: "İlk bölümü atlamayın",
        curator: "Burcu",
        count: 11,
        description:
            "Açılışı yavaş sanıp bıraktığın, aslında her şeyi ilk bölümde kuran diziler.",
    },
];

export default async function ListsPage() {
    const [genreMap, topRated, upcoming] = await Promise.all([
        getGenreMap(),
        getTopRated("movie"),
        getUpcoming(),
    ]);

    return (
        <div className="listsPage">
            <header className="pageHero hasCollage">
                <BackdropCollage items={topRated?.results || []} variant="row" />
                <ContentWrapper>
                    <Breadcrumbs
                        items={[{ name: "Ana sayfa", href: "/" }, { name: "Listeler" }]}
                    />

                    <h1 className="pageTitle">Listeler</h1>
                    <p className="lead listsLead">
                        Editör seçkileri ve topluluğun oluşturduğu listeler. Beğendiğini
                        kaydet, kendi listeni oluştur.
                    </p>
                </ContentWrapper>
            </header>

            <ContentWrapper>
                <div className="listGrid">
                    {LISTS.map((list) => (
                        <Link
                            key={list.slug}
                            href={`/listeler/${list.slug}`}
                            className="listCard"
                        >
                            <h2>{list.name}</h2>
                            <p className="listMeta">
                                {list.curator} · {list.count} yapım
                            </p>
                            <p className="listDesc">{list.description}</p>
                        </Link>
                    ))}
                </div>
            </ContentWrapper>

            <div className="listsCarousels">
                <Carousel
                    title="Her zaman listesi: en yüksek puanlılar"
                    items={(topRated?.results || []).slice(0, 20)}
                    mediaType="movie"
                    genreMap={genreMap}
                    seeAllHref="/kesfet/filmler?sirala=vote_average.desc"
                />

                <Carousel
                    title="Yakında vizyona girecekler"
                    items={(upcoming?.results || []).slice(0, 20)}
                    mediaType="movie"
                    genreMap={genreMap}
                />
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(
                    itemListSchema((topRated?.results || []).slice(0, 20), {
                        name: "En yüksek puanlı filmler",
                        mediaType: "movie",
                        path: "/listeler",
                    })
                )}
            />
        </div>
    );
}
