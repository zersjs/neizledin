import Link from "next/link";
import Image from "next/image";

import { trDate } from "@/lib/format";

/**
 * Haber kartı. `featured` ilk haberi geniş ve öne çıkan biçimde gösterir.
 */
const NewsCard = ({ item, featured = false, priority = false }) => (
    <article className={`newsCard ${featured ? "newsCard--featured" : ""}`}>
        <Link href={`/haberler/${item.slug}`} className="newsCardLink">
            <div className="newsThumb">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt=""
                        fill
                        className="newsThumbImg"
                        sizes={
                            featured
                                ? "(min-width: 768px) 640px, 100vw"
                                : "(min-width: 768px) 380px, 100vw"
                        }
                        priority={priority}
                    />
                ) : (
                    <div className="newsThumbFallback" aria-hidden="true">
                        ?
                    </div>
                )}
            </div>

            <div className="newsCardText">
                {item.date && (
                    <time className="newsDate" dateTime={item.date}>
                        {trDate(item.date)}
                    </time>
                )}
                <h2 className="newsCardTitle">{item.title}</h2>
                {item.excerpt && <p className="newsExcerpt">{item.excerpt}</p>}
            </div>
        </Link>
    </article>
);

export default NewsCard;
