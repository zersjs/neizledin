import Link from "next/link";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import MovieCard from "../movieCard/MovieCard";
import CarouselScroller from "./CarouselScroller";

/**
 * Yatay yapım şeridi. İçerik sunucuda basılır, sadece ok tuşları istemcide.
 */
const Carousel = ({
    title,
    subtitle,
    items = [],
    mediaType,
    genreMap,
    seeAllHref,
    seeAllLabel = "Tümü",
    headingLevel: Heading = "h2",
    priority = false,
}) => {
    if (!items.length) return null;

    return (
        <section className="carousel">
            <ContentWrapper>
                {(title || seeAllHref) && (
                    <div className="sectionHeading">
                        <div>
                            {title && <Heading className="heading">{title}</Heading>}
                            {subtitle && <p className="carouselSubtitle">{subtitle}</p>}
                        </div>
                        {seeAllHref && (
                            <Link href={seeAllHref} className="sectionLink">
                                {seeAllLabel} →
                            </Link>
                        )}
                    </div>
                )}

                <CarouselScroller>
                    {items.map((item, i) => (
                        <MovieCard
                            key={`${item.media_type || mediaType}-${item.id}`}
                            data={item}
                            mediaType={mediaType}
                            genreMap={genreMap}
                            priority={priority && i < 5}
                        />
                    ))}
                </CarouselScroller>
            </ContentWrapper>
        </section>
    );
};

export default Carousel;
