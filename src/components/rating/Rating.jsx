import { score as fmtScore } from "@/lib/format";

/**
 * Poster üzerindeki puan halkası. CircleRating'in yerini alır,
 * ancak harici kütüphane yerine düz SVG kullanır — bundle'a 0 KB ekler.
 * 5'in altı yumuşak kırmızı, üstü marka rengi.
 */
const Rating = ({ rating, size = 44 }) => {
    if (rating === null || rating === undefined) return null;

    const value = Number(rating);
    const stroke = size <= 40 ? 3 : 3.5;
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const progress = Math.max(0, Math.min(value, 10)) / 10;
    const tone = value < 5 ? "low" : "high";

    return (
        <div
            className={`rating rating--${tone}`}
            style={{ width: size, height: size }}
            title={`10 üzerinden ${fmtScore(value)}`}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
                <circle
                    className="ratingTrack"
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={stroke}
                />
                <circle
                    className="ratingBar"
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <span className="ratingValue">{fmtScore(value)}</span>
        </div>
    );
};

export default Rating;
