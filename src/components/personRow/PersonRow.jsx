import Link from "next/link";
import Image from "next/image";

import { IMG } from "@/lib/tmdb";
import { toSlug } from "@/lib/slug";

/** Oyuncu kadrosu şeridi. Her isim taranabilir bir bağlantı. */
const PersonRow = ({ people = [], title = "Oyuncular", limit = 14 }) => {
    if (!people.length) return null;

    return (
        <section className="personRow" aria-labelledby="oyuncular">
            <div className="sectionHeading">
                <h2 id="oyuncular" className="heading">
                    {title}
                </h2>
            </div>

            <ul className="personList">
                {people.slice(0, limit).map((person) => {
                    const img = IMG.profile(person.profile_path);
                    return (
                        <li key={`${person.id}-${person.credit_id || person.character}`}>
                            <Link href={`/kisi/${toSlug(person)}`} className="personItem">
                                <span className="personPhoto">
                                    {img ? (
                                        <Image
                                            src={img}
                                            alt={`${person.name} fotoğrafı`}
                                            fill
                                            sizes="96px"
                                        />
                                    ) : (
                                        <span className="personInitial" aria-hidden="true">
                                            {person.name.charAt(0)}
                                        </span>
                                    )}
                                </span>
                                <span className="personName">{person.name}</span>
                                {person.character && (
                                    <span className="personCharacter">{person.character}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default PersonRow;
