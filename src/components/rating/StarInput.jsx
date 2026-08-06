"use client";

import { useState } from "react";

const STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

/** Yarım yıldız hassasiyetinde puan girişi. */
const StarInput = ({ value = 0, onChange }) => {
    const [hover, setHover] = useState(0);
    const shown = hover || value;

    return (
        <div className="starInput" onMouseLeave={() => setHover(0)}>
            <div className="starInputTrack" role="radiogroup" aria-label="Puanın">
                {STEPS.map((step) => (
                    <button
                        key={step}
                        type="button"
                        role="radio"
                        aria-checked={value === step}
                        aria-label={`${String(step).replace(".", ",")} yıldız`}
                        className={`starHit ${step % 1 === 0 ? "right" : "left"}`}
                        onMouseEnter={() => setHover(step)}
                        onClick={() => onChange(value === step ? 0 : step)}
                    />
                ))}

                <span className="starInputVisual" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => {
                        const fill = Math.max(0, Math.min(1, shown - i));
                        return (
                            <span key={i} className="star">
                                <span className="starEmpty">★</span>
                                <span className="starFill" style={{ width: `${fill * 100}%` }}>
                                    ★
                                </span>
                            </span>
                        );
                    })}
                </span>
            </div>

            <span className="starInputValue">
                {shown ? String(shown).replace(".", ",") : "Henüz puan yok"}
            </span>
        </div>
    );
};

export default StarInput;
