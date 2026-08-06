import "server-only";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export const IMG = {
    poster: (path, size = "w500") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
    backdrop: (path, size = "w1280") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
    profile: (path, size = "w185") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
    // OG görselleri mutlak ve büyük olmalı
    og: (path) => (path ? `https://image.tmdb.org/t/p/w1280${path}` : null),
};

/**
 * TMDB'ye sunucu tarafından istek atar.
 * Anahtar tarayıcıya hiç gitmez; cevaplar ISR ile önbelleklenir.
 */
export async function tmdb(path, params = {}, { revalidate = 3600 } = {}) {
    if (!API_KEY) {
        throw new Error(
            "TMDB_API_KEY tanımlı değil. .env.local dosyasına ekleyin."
        );
    }

    const search = new URLSearchParams({
        api_key: API_KEY,
        language: "tr-TR",
        ...params,
    });

    const res = await fetch(`${BASE_URL}${path}?${search}`, {
        next: { revalidate },
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`TMDB ${res.status}: ${path}`);
    }

    return res.json();
}

/** Hata durumunda sayfayı düşürmek yerine boş sonuç döndürür. */
async function safe(promise, fallback = null) {
    try {
        return await promise;
    } catch {
        return fallback;
    }
}

/* ---------------------------------------------------------------- listeler */

export const getTrending = (window = "day") =>
    safe(tmdb(`/trending/all/${window}`, { region: "TR" }, { revalidate: 1800 }), {
        results: [],
    });

export const getPopular = (mediaType = "movie") =>
    safe(tmdb(`/${mediaType}/popular`, { region: "TR" }), { results: [] });

export const getTopRated = (mediaType = "movie") =>
    safe(tmdb(`/${mediaType}/top_rated`, { region: "TR" }), { results: [] });

export const getAiringToday = () =>
    safe(tmdb("/tv/airing_today", { timezone: "Europe/Istanbul" }, { revalidate: 1800 }), {
        results: [],
    });

export const getUpcoming = () =>
    safe(tmdb("/movie/upcoming", { region: "TR" }), { results: [] });

export const getGenres = (mediaType) =>
    safe(tmdb(`/genre/${mediaType}/list`, {}, { revalidate: 86400 }), {
        genres: [],
    });

/**
 * id -> tür adı eşlemesi. Karusel/kart bileşenleri genre_ids alır,
 * eskiden bunu Redux tutuyordu; artık sunucuda çözülüp prop olarak iniyor.
 */
export async function getGenreMap() {
    const [tv, movie] = await Promise.all([getGenres("tv"), getGenres("movie")]);
    const map = {};
    [...(movie?.genres || []), ...(tv?.genres || [])].forEach((g) => {
        map[g.id] = g.name;
    });
    return map;
}

export const search = (query, page = 1) =>
    safe(
        tmdb(
            "/search/multi",
            { query, page: String(page), include_adult: "false" },
            { revalidate: 600 }
        ),
        { results: [], total_pages: 0, total_results: 0 }
    );

export const discover = (mediaType, params = {}) =>
    safe(
        tmdb(`/discover/${mediaType}`, { include_adult: "false", ...params }),
        { results: [], total_pages: 0, total_results: 0 }
    );

/* ------------------------------------------------------------------ detay */

/**
 * Detay sayfası için gereken her şeyi tek istekte çeker.
 * append_to_response sayesinde 5 ayrı istek yerine 1 istek atılır —
 * TTFB düşer, Core Web Vitals iyileşir.
 */
export async function getTitle(mediaType, id) {
    const data = await safe(
        tmdb(
            `/${mediaType}/${id}`,
            {
                append_to_response:
                    "credits,videos,similar,recommendations,images,external_ids,content_ratings,release_dates,watch/providers",
                include_image_language: "tr,en,null",
            },
            { revalidate: 21600 }
        )
    );

    if (!data || !data.id) return null;

    // Türkçe özet boşsa İngilizce'ye düş — boş sayfa SEO için ölümcül
    if (!data.overview) {
        const en = await safe(
            tmdb(`/${mediaType}/${id}`, { language: "en-US" }, { revalidate: 86400 })
        );
        if (en?.overview) {
            data.overview = en.overview;
            data.overview_lang = "en";
        }
    }

    return data;
}

export const getSeason = (id, seasonNumber) =>
    safe(tmdb(`/tv/${id}/season/${seasonNumber}`, {}, { revalidate: 21600 }));

export const getPerson = (id) =>
    safe(
        tmdb(
            `/person/${id}`,
            { append_to_response: "combined_credits,external_ids" },
            { revalidate: 86400 }
        )
    );
