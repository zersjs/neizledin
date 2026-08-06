import Image from "next/image";
import { IMG } from "@/lib/tmdb";

/**
 * Poster görseli. Eski Img/LazyLoadImage bileşeninin yerini alır:
 * next/image otomatik olarak avif/webp üretir, boyutlandırır ve
 * tembel yükler — dolayısıyla ayrı bir lazy-load kütüphanesi gerekmez.
 *
 * Görsel yoksa marka soru işaretiyle dolu bir yer tutucu basılır;
 * böylece kırık görsel ya da yabancı "no-poster.png" görünmez.
 */
const Poster = ({ path, alt, sizes = "(max-width: 768px) 45vw, 220px", priority = false }) => {
    const src = IMG.poster(path);

    if (!src) {
        return (
            <div className="posterFallback" aria-hidden="true">
                <span>?</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="posterImg"
        />
    );
};

export default Poster;
