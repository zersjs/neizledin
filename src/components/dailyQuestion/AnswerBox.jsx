"use client";

import { useState } from "react";

const AnswerBox = () => {
    const [value, setValue] = useState("");
    const [sent, setSent] = useState(false);

    if (sent) {
        return (
            <p className="dqSent">
                Cevabın yayında. Başkaları ne demiş, akışta görebilirsin.
            </p>
        );
    }

    return (
        <form
            className="dqForm"
            onSubmit={(e) => {
                e.preventDefault();
                if (value.trim()) setSent(true);
            }}
        >
            <input
                type="text"
                value={value}
                maxLength={140}
                placeholder="Cevabın…"
                aria-label="Günün sorusuna cevabın"
                onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className="btn btnPrimary" disabled={!value.trim()}>
                Gönder
            </button>
        </form>
    );
};

export default AnswerBox;
