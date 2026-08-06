import { discover } from "@/lib/tmdb";
import { toSlug } from "@/lib/slug";
import { SITE } from "@/lib/seo";

export const revalidate = 86400;

const PAGES_PER_TYPE = 5; // 5 × 20 = tür başına 100 sayfa

async function collect(mediaType) {
    const pages = await Promise.all(
        Array.from({ length: PAGES_PER_TYPE }, (_, i) =>
            discover(mediaType, {
                page: String(i + 1),
                sort_by: "popularity.desc",
                "vote_count.gte": "50",
            })
        )
    );

    return pages.flatMap((page) => page?.results || []);
}

export default async function sitemap() {
    const now = new Date();

    const staticRoutes = [
        { path: "/", priority: 1, changeFrequency: "hourly" },
        { path: "/akis", priority: 0.9, changeFrequency: "hourly" },
        { path: "/kesfet/filmler", priority: 0.9, changeFrequency: "daily" },
        { path: "/kesfet/diziler", priority: 0.9, changeFrequency: "daily" },
        { path: "/listeler", priority: 0.7, changeFrequency: "weekly" },
        { path: "/hakkinda", priority: 0.4, changeFrequency: "monthly" },
        { path: "/kullanim-kosullari", priority: 0.2, changeFrequency: "yearly" },
        { path: "/gizlilik", priority: 0.2, changeFrequency: "yearly" },
    ].map((route) => ({
        url: `${SITE.url}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    const [movies, shows] = await Promise.all([collect("movie"), collect("tv")]);

    const titleRoutes = [
        ...movies.map((m) => ({ item: m, segment: "film" })),
        ...shows.map((s) => ({ item: s, segment: "dizi" })),
    ].map(({ item, segment }) => ({
        url: `${SITE.url}/${segment}/${toSlug(item)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // Keşfet sayfalarının ilk 10 sayfası da taransın
    const paginated = ["filmler", "diziler"].flatMap((tur) =>
        Array.from({ length: 10 }, (_, i) => ({
            url: `${SITE.url}/kesfet/${tur}?sayfa=${i + 2}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.5,
        }))
    );

    return [...staticRoutes, ...titleRoutes, ...paginated];
}
