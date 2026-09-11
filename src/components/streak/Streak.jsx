import Link from "next/link";

const DAY_LETTERS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];

/** "2026-08-07" -> haftanın günü harfi (Pazartesi = 0) */
function dayLetter(date) {
    const d = new Date(`${date}T00:00:00Z`);
    return DAY_LETTERS[(d.getUTCDay() + 6) % 7];
}

/**
 * Kayıt serisi.
 *
 * Seriyi kaybetmek tek bir unutulan geceye bağlı değil: `freezes` hakkı
 * varsa gün otomatik dondurulur. Amaç suçluluk üretmek değil, geri dönmeyi
 * kolaylaştırmak — kırılan seri kullanıcıyı tamamen kaybettiriyor.
 */
const Streak = ({ data, compact = false }) => {
    const { current, longest, freezes, week, todayLogged } = data;
    const isRecord = current >= longest;

    return (
        <section
            className={`streak ${compact ? "streak--compact" : ""}`}
            aria-labelledby="streakBaslik"
        >
            <div className="streakMain">
                <div className="streakCount">
                    <span className="streakFlame" aria-hidden="true">
                        🔥
                    </span>
                    <div>
                        <p className="streakNumber">
                            {current}
                            <span className="streakUnit">gün</span>
                        </p>
                        <h2 id="streakBaslik" className="streakLabel">
                            {isRecord ? "En uzun serin — şu an" : "Kayıt serisi"}
                        </h2>
                    </div>
                </div>

                <dl className="streakMeta">
                    <div>
                        <dt>En uzun</dt>
                        <dd>{longest} gün</dd>
                    </div>
                    <div>
                        <dt>Dondurma hakkı</dt>
                        <dd>{freezes}</dd>
                    </div>
                </dl>
            </div>

            <ol className="streakWeek">
                {week.map((day, i) => {
                    const isToday = i === week.length - 1;
                    const state = day.logged
                        ? "logged"
                        : day.frozen
                          ? "frozen"
                          : isToday
                            ? "today"
                            : "missed";

                    return (
                        <li key={day.date} className={`streakDay is-${state}`}>
                            <span className="streakDayLetter" aria-hidden="true">
                                {dayLetter(day.date)}
                            </span>
                            <span className="streakDot">
                                <span className="srOnly">
                                    {day.date}:{" "}
                                    {day.logged
                                        ? "kayıt var"
                                        : day.frozen
                                          ? "donduruldu"
                                          : "kayıt yok"}
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ol>

            {!todayLogged && (
                <div className="streakCta">
                    <p>
                        Bugün henüz bir şey kaydetmedin. Seriyi sürdürmek için tek
                        bir kayıt yeter.
                    </p>
                    <Link href="/?kaydet=1" className="btn btnPrimary">
                        Bugünü kaydet
                    </Link>
                </div>
            )}
        </section>
    );
};

export default Streak;
