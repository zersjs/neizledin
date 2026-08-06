/**
 * Tür etiketleri.
 * `data` ya isim dizisi ya da TMDB tür nesneleri dizisi olabilir.
 */
const Genres = ({ data, genreMap, limit = 2, size = "sm" }) => {
    if (!data?.length) return null;

    const names = data
        .map((g) => (typeof g === "object" ? g.name : genreMap?.[g] || null))
        .filter(Boolean)
        .slice(0, limit);

    if (!names.length) return null;

    return (
        <div className={`genres ${size === "lg" ? "genres--lg" : ""}`.trim()}>
            {names.map((name) => (
                <span key={name} className="genre">
                    {name}
                </span>
            ))}
        </div>
    );
};

export default Genres;
