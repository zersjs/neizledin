/** Profil istatistikleri — izleme günlüğünün özeti. */
const StatGrid = ({ items }) => (
    <dl className="statGrid">
        {items.map((s) => (
            <div key={s.label} className="statItem">
                <dt>{s.label}</dt>
                <dd>
                    <span className="statValue">{s.value}</span>
                    {s.suffix && <span className="statSuffix">{s.suffix}</span>}
                </dd>
            </div>
        ))}
    </dl>
);

export default StatGrid;
