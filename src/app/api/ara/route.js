import { NextResponse } from "next/server";

import { IMG, search } from "@/lib/tmdb";
import { toSlug } from "@/lib/slug";
import { year } from "@/lib/format";

/**
 * "Ne izledin?" kayıt ekranındaki anlık arama.
 * TMDB anahtarı burada kalır, tarayıcıya gitmez.
 */
export async function GET(request) {
    const q = request.nextUrl.searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const data = await search(q);

    const results = (data?.results || [])
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, 8)
        .map((item) => ({
            id: item.id,
            mediaType: item.media_type,
            name: item.title || item.name,
            year: year(item.release_date || item.first_air_date),
            poster: IMG.poster(item.poster_path, "w154"),
            slug: toSlug(item),
        }));

    return NextResponse.json(
        { results },
        {
            headers: {
                "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
            },
        }
    );
}
