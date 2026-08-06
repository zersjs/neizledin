import { notFound, permanentRedirect } from "next/navigation";

import TitleDetail from "@/components/titleDetail/TitleDetail";
import { getGenreMap, getPopular, getTitle, IMG } from "@/lib/tmdb";
import { idFromSlug, toSlug } from "@/lib/slug";
import {
    buildMetadata,
    jsonLd,
    titleDescription,
    titleSchema,
    titleTag,
} from "@/lib/seo";

export const revalidate = 21600;
export const dynamicParams = true;

export async function generateStaticParams() {
    const popular = await getPopular("tv");
    return (popular?.results || []).slice(0, 20).map((show) => ({
        slug: toSlug(show),
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const id = idFromSlug(slug);
    if (!id) return { title: "Dizi bulunamadı" };

    const data = await getTitle("tv", id);
    if (!data) return { title: "Dizi bulunamadı", robots: { index: false } };

    return buildMetadata({
        title: titleTag(data, "tv"),
        description: titleDescription(data, "tv"),
        path: `/dizi/${toSlug(data)}`,
        image: IMG.og(data.backdrop_path || data.poster_path),
        imageAlt: `${data.name} afişi`,
        type: "video.tv_show",
        publishedTime: data.first_air_date || undefined,
    });
}

export default async function TvPage({ params }) {
    const { slug } = await params;
    const id = idFromSlug(slug);
    if (!id) notFound();

    const [data, genreMap] = await Promise.all([getTitle("tv", id), getGenreMap()]);
    if (!data) notFound();

    const canonical = toSlug(data);
    if (slug !== canonical) permanentRedirect(`/dizi/${canonical}`);

    return (
        <>
            <TitleDetail data={data} mediaType="tv" genreMap={genreMap} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(titleSchema(data, "tv"))}
            />
        </>
    );
}
