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
// Sitemap'te olmayan bir film istendiğinde de sayfa üretilsin
export const dynamicParams = true;

/** En popüler filmler derleme anında statik üretilir — anında açılır. */
export async function generateStaticParams() {
    const popular = await getPopular("movie");
    return (popular?.results || []).slice(0, 20).map((movie) => ({
        slug: toSlug(movie),
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const id = idFromSlug(slug);
    if (!id) return { title: "Film bulunamadı" };

    const data = await getTitle("movie", id);
    if (!data) return { title: "Film bulunamadı", robots: { index: false } };

    return buildMetadata({
        title: titleTag(data, "movie"),
        description: titleDescription(data, "movie"),
        path: `/film/${toSlug(data)}`,
        image: IMG.og(data.backdrop_path || data.poster_path),
        imageAlt: `${data.title} afişi`,
        type: "video.movie",
        publishedTime: data.release_date || undefined,
    });
}

export default async function MoviePage({ params }) {
    const { slug } = await params;
    const id = idFromSlug(slug);
    if (!id) notFound();

    const [data, genreMap] = await Promise.all([getTitle("movie", id), getGenreMap()]);
    if (!data) notFound();

    // Yanlış ya da eski slug ile gelinirse tek doğru adrese kalıcı yönlendir.
    // Aynı içeriğin birden çok URL'de görünmesi sıralamayı böler.
    const canonical = toSlug(data);
    if (slug !== canonical) permanentRedirect(`/film/${canonical}`);

    return (
        <>
            <TitleDetail data={data} mediaType="movie" genreMap={genreMap} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd(titleSchema(data, "movie"))}
            />
        </>
    );
}
