"use client";

import { useState } from "react";

/** Spoiler yorumu varsayılan olarak gizli; kullanıcı isteyerek açar. */
const SpoilerText = ({ children }) => {
    const [shown, setShown] = useState(false);

    if (shown) return <p className="feedComment">{children}</p>;

    return (
        <button type="button" className="spoilerVeil" onClick={() => setShown(true)}>
            <span className="spoilerVeilText" aria-hidden="true">
                {children}
            </span>
            <span className="spoilerVeilLabel">
                Spoiler içeriyor — görmek için dokun
            </span>
        </button>
    );
};

export default SpoilerText;
