"use client";

import { useState } from "react";

import LogSheet from "../logSheet/LogSheet";

/**
 * Detay sayfasındaki ana eylem. Sayfanın geri kalanı sunucu bileşeni;
 * yalnızca bu buton istemciye iniyor.
 */
const LogCta = ({ name }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="logCta">
                <button
                    type="button"
                    className="btn btnPrimary"
                    onClick={() => setOpen(true)}
                >
                    İzledim, puanla
                </button>
                <button type="button" className="btn btnGhost">
                    Listeme ekle
                </button>
            </div>

            <p className="logCtaHint">
                {name} hakkında ne düşündüğünü bir cümleyle yaz, akışta görünsün.
            </p>

            <LogSheet open={open} onClose={() => setOpen(false)} />
        </>
    );
};

export default LogCta;
