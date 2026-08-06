import Link from "next/link";
import { notFound } from "next/navigation";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import StatGrid from "@/components/statGrid/StatGrid";
import Stars from "@/components/rating/Stars";
import Compatibility from "@/components/compatibility/Compatibility";
import BackdropCollage from "@/components/backdropCollage/BackdropCollage";
import { getTopRated } from "@/lib/tmdb";
import { COMPATIBILITY, CURRENT_USER, DIARY } from "@/lib/mock";
import { abs, buildMetadata, jsonLd } from "@/lib/seo";
import { count, trDate } from "@/lib/format";

export async function generateMetadata({ params }) {
    const { kullanici } = await params;

    return buildMetadata({
        title: `${kullanici} — izleme günlüğü`,
        description: `${kullanici} kullanıcısının izlediği film ve diziler, verdiği puanlar ve yazdığı yorumlar.`,
        path: `/profil/${kullanici}`,
    });
}

export default async function ProfilePage({ params }) {
    const { kullanici } = await params;

    // Backend gelene kadar yalnızca örnek profil var
    if (kullanici !== CURRENT_USER.username) notFound();

    const user = CURRENT_USER;
    const s = user.stats;

    // Yıl sonu kartının arka planı — backend gelince kullanıcının
    // gerçekten izlediği yapımların afişleri buraya gelecek
    const topRated = await getTopRated("movie");
    const posters = topRated?.results || [];

    const stats = [
        { label: "Bu hafta", value: s.thisWeekEpisodes, suffix: "bölüm" },
        { label: "Bu ay", value: s.thisMonthMovies, suffix: "film" },
        { label: "Toplam", value: count(s.totalHours), suffix: "saat" },
        { label: "En çok tür", value: s.topGenre },
        { label: "En çok oyuncu", value: s.topActor },
        { label: "Ortalama puan", value: String(s.averageScore).replace(".", ",") },
    ];

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: abs(`/profil/${user.username}`),
        mainEntity: {
            "@type": "Person",
            name: user.displayName,
            alternateName: user.username,
            description: user.bio,
            url: abs(`/profil/${user.username}`),
        },
    };

    return (
        <div className="pageShell profilePage">
            <ContentWrapper>
                <Breadcrumbs
                    items={[
                        { name: "Ana sayfa", href: "/" },
                        { name: "Profiller", href: "/akis" },
                        { name: user.displayName },
                    ]}
                />

                <header className="profileHead">
                    <span className="profileAvatar" aria-hidden="true">
                        {user.displayName.charAt(0)}
                    </span>

                    <div className="profileMeta">
                        <h1>{user.displayName}</h1>
                        <p className="profileHandle">@{user.username}</p>
                        <p className="profileBio">{user.bio}</p>
                        <p className="profileCounts">
                            <strong>{count(s.followers)}</strong> takipçi ·{" "}
                            <strong>{count(s.following)}</strong> takip
                        </p>
                    </div>

                    <button type="button" className="btn btnPrimary profileFollow">
                        Takip et
                    </button>
                </header>

                <section className="profileSection" aria-labelledby="istatistik">
                    <div className="sectionHeading">
                        <h2 id="istatistik" className="heading">
                            İzleme özeti
                        </h2>
                    </div>
                    <StatGrid items={stats} />
                </section>

                {/* Yıl sonu özeti — paylaşılabilir, markanın adını taşıyan içerik */}
                <section className="wrapCard hasCollage">
                    <BackdropCollage items={posters} variant="card" />
                    <span className="badge badgeBrand">Yıl sonu</span>
                    <h2>2026’da Ne İzledin?</h2>
                    <p>
                        Yılın bitmesine daha var ama özetin şimdiden şekilleniyor.
                        Aralık’ta paylaşılabilir kartın hazır olacak.
                    </p>
                    <button type="button" className="btn btnGhost">
                        Önizlemeyi gör
                    </button>
                </section>

                <section className="profileSection" aria-labelledby="gunluk">
                    <div className="sectionHeading">
                        <h2 id="gunluk" className="heading">
                            İzleme günlüğü
                        </h2>
                        <span className="sectionLink">Son 30 gün</span>
                    </div>

                    <ol className="diary">
                        {DIARY.map((entry) => (
                            <li key={`${entry.slug}-${entry.date}`} className="diaryRow">
                                <time dateTime={entry.date} className="diaryDate">
                                    {trDate(entry.date)}
                                </time>

                                <Link
                                    href={`/${entry.type}/${entry.slug}`}
                                    className="diaryTitle"
                                >
                                    {entry.name}
                                    {entry.episode && (
                                        <span className="diaryEp"> {entry.episode}</span>
                                    )}
                                </Link>

                                <span className="diaryRating">
                                    <Stars value={entry.rating} size={13} />
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="profileSection">
                    <Compatibility data={COMPATIBILITY} />
                </section>
            </ContentWrapper>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(personSchema)}
            />
        </div>
    );
}
