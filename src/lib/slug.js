const TR_MAP = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    i: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
};

/**
 * Türkçe karakterleri ASCII'ye çevirip URL'e uygun hale getirir.
 * "Kara Şövalye Yükseliyor" -> "kara-sovalye-yukseliyor"
 */
export function slugify(input = "") {
    return String(input)
        .replace(/[çÇğĞıIİiöÖşŞüÜ]/g, (ch) => TR_MAP[ch] ?? ch)
        .normalize("NFD")
        // eslint-disable-next-line no-misleading-character-class
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/&/g, " ve ")
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
        .replace(/-+$/g, "");
}

/**
 * SEO dostu URL parçası: "severance-95396"
 * Başlık okunur kalsın diye slug önde, kimlik sonda.
 */
export function toSlug(item) {
    const name = item?.title || item?.name || item?.original_title || "";
    const s = slugify(name);
    return s ? `${s}-${item.id}` : String(item.id);
}

/** "severance-95396" -> 95396. Sadece sondaki sayı kimliktir. */
export function idFromSlug(slug = "") {
    const match = String(slug).match(/(\d+)$/);
    return match ? match[1] : null;
}

/** URL'de yanlış slug varsa doğrusuna 301 atmak için karşılaştırma. */
export function isCanonicalSlug(slug, item) {
    return slug === toSlug(item);
}

const MEDIA_SEGMENT = { movie: "film", tv: "dizi" };
const SEGMENT_MEDIA = { film: "movie", dizi: "tv" };

/** TMDB media_type -> URL segmenti */
export const mediaSegment = (mediaType) => MEDIA_SEGMENT[mediaType] || "film";

/** URL segmenti -> TMDB media_type */
export const segmentMedia = (segment) => SEGMENT_MEDIA[segment] || null;

/** Bir TMDB nesnesi için tam yol üretir. */
export function hrefFor(item, fallbackMediaType) {
    const type = item?.media_type || fallbackMediaType || "movie";
    if (type === "person") return `/kisi/${toSlug(item)}`;
    return `/${mediaSegment(type)}/${toSlug(item)}`;
}
