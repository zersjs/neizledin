/**
 * 5 yıldız üzerinden gösterim (yarım yıldız destekli).
 * Sunucuda render edilir; erişilebilirlik için metin karşılığı da verilir.
 */
const Stars = ({ value = 0, size = 15 }) => {
    const label = String(value).replace(".", ",");

    return (
        <span
            className="stars"
            style={{ "--star-size": `${size}px` }}
            role="img"
            aria-label={`5 üzerinden ${label}`}
        >
            {[0, 1, 2, 3, 4].map((i) => {
                const fill = Math.max(0, Math.min(1, value - i));
                return (
                    <span key={i} className="star">
                        <span className="starEmpty" aria-hidden="true">
                            ★
                        </span>
                        <span
                            className="starFill"
                            aria-hidden="true"
                            style={{ width: `${fill * 100}%` }}
                        >
                            ★
                        </span>
                    </span>
                );
            })}
        </span>
    );
};

export default Stars;
