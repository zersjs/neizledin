import Image from "next/image";

import { IMG } from "@/lib/tmdb";

/**
 * Popüler yapımların afişlerinden oluşan dekoratif arka plan.
 *
 * Neden tek bir backdrop değil de mozaik: tek bir filmin backdrop'u sayfayı
 * "o filmin sayfası" gibi gösterir. Mozaik ise platformun kendisini anlatır
 * ve marka kimliğindeki "posterler güçlü biçimde öne çıksın ama zemin
 * sinematik kalsın" yönüne uyar.
 *
 * Tamamen dekoratif olduğu için aria-hidden ve alt="" — ekran okuyucular atlar.
 */
const BackdropCollage = ({ items = [], variant = "grid", className = "" }) => {
    const posters = items.filter((item) => item.poster_path);
    if (posters.length < 6) return null;

    // Döndürülmüş ızgara çerçeveyi taştığı için boşluk kalmasın diye
    // görünen hücre sayısından fazlasını basıyoruz
    const count = variant === "row" ? 16 : 24;
    const cells = [];
    for (let i = 0; i < count; i += 1) {
        cells.push(posters[i % posters.length]);
    }

    return (
        <div className={`collage collage--${variant} ${className}`.trim()} aria-hidden="true">
            <div className="collageGrid">
                {cells.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="collageCell">
                        <Image
                            src={IMG.poster(item.poster_path, "w342")}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 30vw, 220px"
                            quality={70}
                        />
                    </div>
                ))}
            </div>
            <div className="collageVeil" />
        </div>
    );
};

export default BackdropCollage;
