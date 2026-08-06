import Link from "next/link";

import Poster from "../poster/Poster";
import Rating from "../rating/Rating";
import Genres from "../genres/Genres";
import { hrefFor } from "@/lib/slug";
import { year } from "@/lib/format";

/**
 * Izgara kartı.
 * Kart tamamen <a> içinde — eskiden onClick + navigate vardı, o yüzden
 * arama motorları kartlara hiç ulaşamıyordu. Artık her kart taranabilir bir bağlantı.
 */
const MovieCard = ({ data, mediaType, genreMap, showMeta = true, priority = false }) => {
    if (!data) return null;

    const name = data.title || data.name;
    const date = data.release_date || data.first_air_date;
    const type = data.media_type || mediaType;

    return (
        <article className="movieCard">
            <Link href={hrefFor(data, mediaType)} className="movieCardLink">
                <div className="posterBlock">
                    <Poster
                        path={data.poster_path}
                        alt={`${name} afişi`}
                        priority={priority}
                    />

                    {showMeta && (
                        <div className="posterOverlay">
                            <Rating rating={data.vote_average} size={40} />
                            <Genres data={data.genre_ids} genreMap={genreMap} />
                        </div>
                    )}
                </div>

                <div className="textBlock">
                    <h3 className="title">{name}</h3>
                    <p className="date">
                        {type === "tv" ? "Dizi" : "Film"}
                        {date ? ` · ${year(date)}` : ""}
                    </p>
                </div>
            </Link>
        </article>
    );
};

export default MovieCard;
