import Stars from "../rating/Stars";

/**
 * Sinema uyumu kartı. Paylaşılmak üzere tasarlandı —
 * sosyal medyada en çok dolaşan ekran bu olacak.
 */
const Compatibility = ({ data }) => {
    const { with: other, score, shared, conflicts } = data;

    return (
        <section className="compat" aria-labelledby="uyum">
            <div className="compatHead">
                <div>
                    <h2 id="uyum">Sinema uyumunuz</h2>
                    <p className="compatWho">
                        Sen ve <strong>{other.displayName}</strong>
                    </p>
                </div>
                <div className="compatScore" aria-label={`Yüzde ${score} uyum`}>
                    <span className="compatValue">%{score}</span>
                </div>
            </div>

            <div className="compatBar" aria-hidden="true">
                <span style={{ width: `${score}%` }} />
            </div>

            <div className="compatCols">
                <div>
                    <h3>Ortak favoriler</h3>
                    <ul className="compatShared">
                        {shared.map((name) => (
                            <li key={name}>
                                <span className="badge badgeBrand">{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Anlaşamadıklarınız</h3>
                    <ul className="compatConflicts">
                        {conflicts.map((c) => (
                            <li key={c.name}>
                                <span className="conflictName">{c.name}</span>
                                <span className="conflictScores">
                                    <Stars value={c.you} size={12} />
                                    <span className="vs">·</span>
                                    <Stars value={c.them} size={12} />
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Compatibility;
