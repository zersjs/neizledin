import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import MovieCard from "@/components/movieCard/MovieCard";
import { getGenreMap, getPerson, IMG } from "@/lib/tmdb";
import { idFromSlug, toSlug } from "@/lib/slug";
import { abs, buildMetadata, jsonLd } from "@/lib/seo";
import { clamp, trDate } from "@/lib/format";

export const revalidate = 86400;

const DEPARTMENT_TR = {
    Acting: "Oyunculuk",
    Directing: "Yönetmenlik",
    Writing: "Senaryo",
    Production: "Yapım",
    Sound: "Ses",
    Camera: "Görüntü",
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const id = idFromSlug(slug);
    if (!id) return { title: "Kişi bulunamadı" };

    const person = await getPerson(id);
    if (!person) return { title: "Kişi bulunamadı", robots: { index: false } };

    const known = (person.combined_credits?.cast || [])
        .slice(0, 3)
        .map((c) => c.title || c.name)
        .filter(Boolean)
        .join(", ");

    return buildMetadata({
        title: `${person.name} — Filmleri, Dizileri ve Yorumları`,
        description:
            person.biography ||
            `${person.name} kimdir? Rol aldığı film ve diziler${
                known ? ` (${known})` : ""
            }, izleyici puanları ve yorumları.`,
        path: `/kisi/${toSlug(person)}`,
        image: IMG.og(person.profile_path),
        imageAlt: person.name,
        type: "profile",
    });
}

export default async function PersonPage({ params }) {
    const { slug } = await params;
    const id = idFromSlug(slug);
    if (!id) notFound();

    const [person, genreMap] = await Promise.all([getPerson(id), getGenreMap()]);
    if (!person) notFound();

    const canonical = toSlug(person);
    if (slug !== canonical) permanentRedirect(`/kisi/${canonical}`);

    const photo = IMG.profile(person.profile_path, "h632");

    // En bilinen işler önce; aynı yapım birden çok kez gelebiliyor, tekilleştir
    const seen = new Set();
    const credits = [...(person.combined_credits?.cast || [])]
        .filter((c) => {
            const key = `${c.media_type}-${c.id}`;
            if (seen.has(key) || !c.poster_path) return false;
            seen.add(key);
            return true;
        })
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": abs(`/kisi/${canonical}`) + "#person",
        name: person.name,
        url: abs(`/kisi/${canonical}`),
        image: IMG.og(person.profile_path) || undefined,
        description: clamp(person.biography, 300) || undefined,
        birthDate: person.birthday || undefined,
        deathDate: person.deathday || undefined,
        birthPlace: person.place_of_birth || undefined,
        jobTitle: DEPARTMENT_TR[person.known_for_department] || person.known_for_department,
        sameAs: [
            person.external_ids?.imdb_id &&
                `https://www.imdb.com/name/${person.external_ids.imdb_id}/`,
            person.external_ids?.instagram_id &&
                `https://instagram.com/${person.external_ids.instagram_id}`,
        ].filter(Boolean),
    };

    return (
        <div className="pageShell personPage">
            <ContentWrapper>
                <Breadcrumbs
                    items={[
                        { name: "Ana sayfa", href: "/" },
                        { name: "Kişiler", href: "/kesfet/filmler" },
                        { name: person.name },
                    ]}
                />

                <header className="personHead">
                    <div className="personPortrait">
                        {photo ? (
                            <Image
                                src={photo}
                                alt={`${person.name} fotoğrafı`}
                                fill
                                sizes="(max-width: 768px) 45vw, 260px"
                                priority
                            />
                        ) : (
                            <span className="personInitial" aria-hidden="true">
                                {person.name.charAt(0)}
                            </span>
                        )}
                    </div>

                    <div className="personInfo">
                        <h1>{person.name}</h1>
                        <p className="personRole">
                            {DEPARTMENT_TR[person.known_for_department] ||
                                person.known_for_department}
                        </p>

                        <dl className="personFacts">
                            {person.birthday && (
                                <div>
                                    <dt>Doğum</dt>
                                    <dd>{trDate(person.birthday)}</dd>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div>
                                    <dt>Doğum yeri</dt>
                                    <dd>{person.place_of_birth}</dd>
                                </div>
                            )}
                            {person.deathday && (
                                <div>
                                    <dt>Ölüm</dt>
                                    <dd>{trDate(person.deathday)}</dd>
                                </div>
                            )}
                        </dl>

                        {person.biography && (
                            <div className="personBio">
                                <h2>Biyografi</h2>
                                <p>{person.biography}</p>
                            </div>
                        )}
                    </div>
                </header>

                {credits.length > 0 && (
                    <section aria-labelledby="yapimlar">
                        <div className="sectionHeading">
                            <h2 id="yapimlar" className="heading">
                                Öne çıkan yapımları
                            </h2>
                        </div>

                        <div className="grid">
                            {credits.map((item) => (
                                <MovieCard
                                    key={`${item.media_type}-${item.id}`}
                                    data={item}
                                    genreMap={genreMap}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </ContentWrapper>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(personSchema)}
            />
        </div>
    );
}
