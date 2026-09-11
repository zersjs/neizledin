import { trDate } from "@/lib/format";

/**
 * Rozetler.
 *
 * Kazanılmamış rozetler de listelenir ve ilerlemesi yazar — bir sonraki
 * adımın görünür olması, yalnızca kazanılanları göstermekten daha iyi
 * çalışır. Kilitli rozet gizlenmez, soluklaştırılır.
 */
const Badges = ({ items }) => {
    const earned = items.filter((b) => b.earned).length;

    return (
        <section className="badges" aria-labelledby="rozetBaslik">
            <div className="sectionHeading">
                <h2 id="rozetBaslik" className="heading">
                    Rozetler
                </h2>
                <span className="sectionLink">
                    {earned}/{items.length} kazanıldı
                </span>
            </div>

            <ul className="badgeGrid">
                {items.map((badge) => (
                    <li
                        key={badge.id}
                        className={`badgeCard ${badge.earned ? "is-earned" : "is-locked"}`}
                    >
                        <span className="badgeIcon" aria-hidden="true">
                            {badge.icon}
                        </span>

                        <div className="badgeText">
                            <p className="badgeName">{badge.name}</p>
                            <p className="badgeDesc">{badge.description}</p>

                            {badge.earned ? (
                                <p className="badgeEarned">
                                    {trDate(badge.earnedAt)} tarihinde kazanıldı
                                </p>
                            ) : (
                                <>
                                    <div
                                        className="badgeBar"
                                        role="progressbar"
                                        aria-valuenow={badge.progress.current}
                                        aria-valuemin={0}
                                        aria-valuemax={badge.progress.total}
                                        aria-label={`${badge.name} ilerlemesi`}
                                    >
                                        <span
                                            style={{
                                                width: `${Math.round(
                                                    (badge.progress.current /
                                                        badge.progress.total) *
                                                        100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="badgeProgress">
                                        {badge.progress.current}/{badge.progress.total}
                                    </p>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Badges;
