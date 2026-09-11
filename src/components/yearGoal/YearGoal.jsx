const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Yıllık izleme hedefi.
 *
 * Hedefin yanında "tempo" da gösterilir: bugün itibarıyla kaç yapımda
 * olman gerektiği. Sadece yüzde göstermek geride kalanı cezalandırır;
 * tempo farkı ne yapılacağını söyler.
 */
const YearGoal = ({ data }) => {
    const { year, target, watched, pace } = data;

    const percent = Math.min(100, Math.round((watched / target) * 100));
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    const diff = watched - pace;
    const remaining = Math.max(0, target - watched);

    return (
        <section className="yearGoal" aria-labelledby="hedefBaslik">
            <div className="yearGoalRing">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle
                        className="yearGoalTrack"
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        strokeWidth="9"
                    />
                    <circle
                        className="yearGoalBar"
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <div className="yearGoalCenter">
                    <span className="yearGoalPercent">%{percent}</span>
                    <span className="yearGoalFraction">
                        {watched}/{target}
                    </span>
                </div>
            </div>

            <div className="yearGoalBody">
                <h2 id="hedefBaslik">{year} hedefin</h2>
                <p className="yearGoalLead">
                    {remaining > 0
                        ? `Hedefe ${remaining} yapım kaldı.`
                        : "Hedefini tamamladın. Yeni hedef koyabilirsin."}
                </p>

                <p
                    className={`yearGoalPace ${diff >= 0 ? "is-ahead" : "is-behind"}`}
                >
                    {diff >= 0
                        ? `Temponun ${diff} yapım önündesin.`
                        : `Temponun ${Math.abs(diff)} yapım gerisindesin.`}
                </p>

                <button type="button" className="btn btnGhost yearGoalEdit">
                    Hedefi düzenle
                </button>
            </div>
        </section>
    );
};

export default YearGoal;
