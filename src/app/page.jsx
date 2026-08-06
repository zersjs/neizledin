import Link from "next/link";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import SearchBox from "@/components/searchBox/SearchBox";
import SwitchTabs from "@/components/switchTabs/SwitchTabs";
import Carousel from "@/components/carousel/Carousel";
import DailyQuestion from "@/components/dailyQuestion/DailyQuestion";
import FeedCard from "@/components/feedCard/FeedCard";
import BackdropCollage from "@/components/backdropCollage/BackdropCollage";

import { getGenreMap, getPopular, getTopRated, getTrending, getAiringToday } from "@/lib/tmdb";
import { FEED, HOME_FAQ } from "@/lib/mock";
import { SITE, buildMetadata, faqSchema, itemListSchema, jsonLd } from "@/lib/seo";

export const revalidate = 1800;

export const metadata = buildMetadata({
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
        "İzlediğin film ve dizileri kaydet, puanla, yorumla. Arkadaşlarının ne izlediğini gör, her bölümden sonra tartışmaya katıl. İzlediklerin kaybolmasın.",
    path: "/",
});

export default async function HomePage({ searchParams }) {
    const params = await searchParams;
    const trendWindow = params?.trend === "hafta" ? "week" : "day";

    const [genreMap, trending, popularMovies, popularTv, topRated, airing] =
        await Promise.all([
            getGenreMap(),
            getTrending(trendWindow),
            getPopular("movie"),
            getPopular("tv"),
            getTopRated("movie"),
            getAiringToday(),
        ]);

    const trendingItems = (trending?.results || []).slice(0, 20);

    // Hero mozaiği: film ve dizi afişleri karışsın ki platform tek türlü görünmesin
    const heroPosters = [
        ...(popularMovies?.results || []),
        ...(popularTv?.results || []),
    ].filter((item) => item.poster_path);

    return (
        <>
            {/* ------------------------------------------------------------ hero */}
            <section className="hero hasCollage">
                <BackdropCollage items={heroPosters} variant="grid" />
                <ContentWrapper>
                    <h1 className="heroTitle">
                        Bugün ne izledin<span className="q">?</span>
                    </h1>
                    <p className="heroLead">
                        İzlediklerini kaydet, puanla ve yorumla. Arkadaşlarının ne
                        izlediğini gör, her bölümden sonra tartışmaya katıl.
                    </p>

                    <SearchBox />

                    <p className="heroHint">
                        Aklında bir şey yok mu?{" "}
                        <Link href="/kesfet/filmler">Filmleri keşfet</Link> ya da{" "}
                        <Link href="/kesfet/diziler">dizilere göz at</Link>.
                    </p>
                </ContentWrapper>
            </section>

            <DailyQuestion posters={trendingItems} />

            {/* -------------------------------------------------------- gündemde */}
            <section className="trendingSection">
                <ContentWrapper>
                    <div className="sectionHeading trendingHead">
                        <h2 className="heading">Bugün konuşulanlar</h2>
                        <SwitchTabs
                            ariaLabel="Zaman aralığı"
                            tabs={[
                                { label: "Bugün", href: "/", active: trendWindow === "day" },
                                {
                                    label: "Bu hafta",
                                    href: "/?trend=hafta",
                                    active: trendWindow === "week",
                                },
                            ]}
                        />
                    </div>
                </ContentWrapper>

                <Carousel
                    title=""
                    items={trendingItems}
                    genreMap={genreMap}
                    headingLevel="h3"
                    priority
                />
            </section>

            {/* ------------------------------------------------------------ akış */}
            <section className="feedPreview">
                <ContentWrapper>
                    <div className="sectionHeading">
                        <h2 className="heading">Arkadaşların ne izledi?</h2>
                        <Link href="/akis" className="sectionLink">
                            Tüm akış →
                        </Link>
                    </div>

                    <div className="feedList">
                        {FEED.slice(0, 3).map((item) => (
                            <FeedCard key={item.id} item={item} />
                        ))}
                    </div>

                    <Link href="/akis" className="btn btnGhost feedMore">
                        Akışın tamamını gör
                    </Link>
                </ContentWrapper>
            </section>

            <Carousel
                title="Bu akşam ne izlesem?"
                subtitle="Şu an en çok izlenen filmler"
                items={popularMovies?.results?.slice(0, 20) || []}
                mediaType="movie"
                genreMap={genreMap}
                seeAllHref="/kesfet/filmler"
            />

            <Carousel
                title="Herkesin izlediği diziler"
                items={popularTv?.results?.slice(0, 20) || []}
                mediaType="tv"
                genreMap={genreMap}
                seeAllHref="/kesfet/diziler"
            />

            <Carousel
                title="Bugün yeni bölümü çıkanlar"
                subtitle="Bölüm biter bitmez tartışma başlıyor"
                items={airing?.results?.slice(0, 20) || []}
                mediaType="tv"
                genreMap={genreMap}
            />

            <Carousel
                title="Zamana meydan okuyanlar"
                subtitle="En yüksek puanlı filmler"
                items={topRated?.results?.slice(0, 20) || []}
                mediaType="movie"
                genreMap={genreMap}
                seeAllHref="/kesfet/filmler?sirala=vote_average.desc"
            />

            {/* --------------------------------------------------- konumlandırma */}
            <section className="pitch">
                <ContentWrapper>
                    <div className="pitchGrid">
                        <div className="pitchCard">
                            <span className="pitchNum" aria-hidden="true">
                                01
                            </span>
                            <h2>İzlediklerin kaybolmasın</h2>
                            <p>
                                Her film, her bölüm günlüğüne düşer. Yıl sonunda
                                “2026’da Ne İzledin?” özetin hazır olur.
                            </p>
                        </div>
                        <div className="pitchCard">
                            <span className="pitchNum" aria-hidden="true">
                                02
                            </span>
                            <h2>Spoiler’a çarpmadan konuş</h2>
                            <p>
                                Her yapımın spoilersız ve spoilerlı alanı ayrı. Dizilerde
                                tartışma bölüm bazlı ilerler.
                            </p>
                        </div>
                        <div className="pitchCard">
                            <span className="pitchNum" aria-hidden="true">
                                03
                            </span>
                            <h2>Senin gibi izleyenleri bul</h2>
                            <p>
                                Profilleri karşılaştır, sinema uyumunu gör. Ortak
                                favoriler ve zıt puanlar tek ekranda.
                            </p>
                        </div>
                    </div>
                </ContentWrapper>
            </section>

            {/* ------------------------------------------------------------- SSS */}
            <section className="faq">
                <ContentWrapper>
                    <h2 className="pageTitle">Sık sorulanlar</h2>
                    <div className="faqList">
                        {HOME_FAQ.map((item) => (
                            <details key={item.q} className="faqItem">
                                <summary>{item.q}</summary>
                                <p>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </ContentWrapper>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(faqSchema(HOME_FAQ))}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(
                    itemListSchema(trendingItems, {
                        name: "Bugün konuşulan film ve diziler",
                        path: "/",
                    })
                )}
            />
        </>
    );
}
