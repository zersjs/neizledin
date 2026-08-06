import { IMG } from "./tmdb";
import { hrefFor, toSlug } from "./slug";
import { clamp, isoDuration, year } from "./format";

export const SITE = {
    name: "Ne İzledin?",
    shortName: "neizledin",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://neizledin.com",
    tagline: "Ekran kapandı, sohbet başladı.",
    description:
        "İzlediklerini kaydet, puanla ve yorumla. Arkadaşlarının ne izlediğini gör, her bölümden sonra tartışmaya katıl. İzlediklerin kaybolmasın.",
    locale: "tr_TR",
    twitter: "@neizledin",
};

export const abs = (path = "/") => new URL(path, SITE.url).toString();

/**
 * Sayfa metadata'sı üretir. Her sayfada canonical zorunlu —
 * aynı içeriğe farklı slug'larla erişilebildiği için kritik.
 */
export function buildMetadata({
    title,
    description,
    path = "/",
    image,
    imageAlt,
    type = "website",
    noIndex = false,
    publishedTime,
} = {}) {
    const url = abs(path);
    const desc = clamp(description || SITE.description, 158);
    const ogImage = image || abs("/opengraph-image");

    return {
        title,
        description: desc,
        alternates: {
            canonical: url,
        },
        robots: noIndex
            ? { index: false, follow: true }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      "max-image-preview": "large",
                      "max-snippet": -1,
                      "max-video-preview": -1,
                  },
              },
        openGraph: {
            type,
            url,
            siteName: SITE.name,
            locale: SITE.locale,
            title: title ? `${title}` : SITE.name,
            description: desc,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: imageAlt || title || SITE.name,
                },
            ],
            ...(publishedTime ? { publishedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            site: SITE.twitter,
            title: title || SITE.name,
            description: desc,
            images: [ogImage],
        },
    };
}

/* ============================================================ JSON-LD ==== */

export const jsonLd = (data) => ({
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
});

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        alternateName: ["ne izledin?", "neizledin"],
        url: SITE.url,
        description: SITE.description,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE.url}/#organization` },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE.url}/ara?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        slogan: SITE.tagline,
        logo: {
            "@type": "ImageObject",
            url: abs("/logo.png"),
            width: 512,
            height: 512,
        },
    };
}

export function breadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            ...(item.href ? { item: abs(item.href) } : {}),
        })),
    };
}

/** Ana yapım şeması: Movie veya TVSeries */
export function titleSchema(data, mediaType) {
    const isMovie = mediaType === "movie";
    const name = data.title || data.name;
    const directors = (data.credits?.crew || [])
        .filter((c) => c.job === "Director")
        .slice(0, 3);
    const cast = (data.credits?.cast || []).slice(0, 8);

    const schema = {
        "@context": "https://schema.org",
        "@type": isMovie ? "Movie" : "TVSeries",
        "@id": abs(hrefFor(data, mediaType)) + "#title",
        url: abs(hrefFor(data, mediaType)),
        name,
        alternateName: data.original_title || data.original_name || undefined,
        description: data.overview || undefined,
        image: IMG.og(data.poster_path) || undefined,
        inLanguage: data.original_language,
        genre: (data.genres || []).map((g) => g.name),
        datePublished: data.release_date || data.first_air_date || undefined,
        actor: cast.map((p) => ({
            "@type": "Person",
            name: p.name,
            url: abs(`/kisi/${toSlug(p)}`),
        })),
    };

    if (directors.length) {
        schema.director = directors.map((p) => ({
            "@type": "Person",
            name: p.name,
        }));
    }

    if (isMovie && data.runtime) {
        schema.duration = isoDuration(data.runtime);
    }

    if (!isMovie) {
        schema.numberOfSeasons = data.number_of_seasons;
        schema.numberOfEpisodes = data.number_of_episodes;
        if (data.created_by?.length) {
            schema.creator = data.created_by.map((p) => ({
                "@type": "Person",
                name: p.name,
            }));
        }
    }

    if (data.vote_count > 0) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: Number(data.vote_average.toFixed(1)),
            ratingCount: data.vote_count,
            bestRating: 10,
            worstRating: 0,
        };
    }

    const trailer = (data.videos?.results || []).find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
    );
    if (trailer) {
        schema.trailer = {
            "@type": "VideoObject",
            name: trailer.name,
            description: clamp(data.overview, 200) || name,
            thumbnailUrl: `https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`,
            uploadDate: data.release_date || data.first_air_date || undefined,
            embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
        };
    }

    return schema;
}

/** Karusel/ızgara listeleri için — Google zengin sonuçlarda kullanır */
export function itemListSchema(items, { name, mediaType, path }) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        url: abs(path),
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: abs(hrefFor(item, mediaType)),
            name: item.title || item.name,
        })),
    };
}

/** SSS bloğu — arama sonuçlarında açılır kutu olarak çıkabilir */
export function faqSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
}

/** Detay sayfasındaki başlık etiketleri — kısa ve arama niyetine uygun */
export function titleTag(data, mediaType) {
    const name = data.title || data.name;
    const y = year(data.release_date || data.first_air_date);
    const kind = mediaType === "movie" ? "Film" : "Dizi";
    return `${name}${y ? ` (${y})` : ""} — ${kind} Yorumları ve Puanı`;
}

export function titleDescription(data, mediaType) {
    const name = data.title || data.name;
    const y = year(data.release_date || data.first_air_date);
    const kind = mediaType === "movie" ? "filmi" : "dizisi";
    const base = data.overview
        ? clamp(data.overview, 100)
        : `${name} hakkında konu, oyuncular ve fragman.`;
    return `${name}${y ? ` (${y})` : ""} ${kind}: ${base} İzleyen herkesin puanı, yorumları ve spoilerlı tartışması Ne İzledin?'de.`;
}
