import Link from "next/link";

import Poster from "@/components/poster/Poster";
import { episodeCode } from "@/lib/format";

/**
 * "Kaldığın yerden devam et" rafı.
 *
 * Dizi kaydı tutan bir üründe en güçlü geri dönüş sebebi, sıradaki bölümün
 * hazır beklemesi. Kullanıcıya "ne izleyeyim" sorusunu sordurmadan
 * bıraktığı yeri gösterir.
 */
const UpNext = ({ items }) => {
    if (!items?.length) return null;

    return (
        <section className="upNext" aria-labelledby="upNextBaslik">
            <div className="sectionHeading">
                <h2 id="upNextBaslik" className="heading">
                    Kaldığın yerden devam et
                </h2>
                <Link href="/profil/resul" className="sectionLink">
                    Günlüğüm →
                </Link>
            </div>

            <ul className="upNextList">
                {items.map((item) => {
                    const percent = Math.round((item.watched / item.total) * 100);

                    return (
                        <li key={item.slug} className="upNextItem">
                            <Link
                                href={`/dizi/${item.slug}`}
                                className="upNextLink"
                            >
                                <div className="upNextPoster">
                                    <Poster
                                        path={item.poster}
                                        alt={item.name}
                                        sizes="(max-width: 768px) 30vw, 110px"
                                    />
                                </div>

                                <div className="upNextBody">
                                    <p className="upNextShow">{item.name}</p>
                                    <p className="upNextEp">
                                        <span className="upNextCode">
                                            {episodeCode(item.season, item.episode)}
                                        </span>
                                        {item.epTitle}
                                    </p>

                                    <div
                                        className="upNextBar"
                                        role="progressbar"
                                        aria-valuenow={item.watched}
                                        aria-valuemin={0}
                                        aria-valuemax={item.total}
                                        aria-label={`${item.name}: ${item.total} bölümün ${item.watched} tanesi izlendi`}
                                    >
                                        <span style={{ width: `${percent}%` }} />
                                    </div>
                                    <p className="upNextCount">
                                        {item.watched}/{item.total} bölüm
                                    </p>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default UpNext;
