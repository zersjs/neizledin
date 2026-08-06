"use client";

import { useState } from "react";
import Image from "next/image";
import { VscChromeClose } from "react-icons/vsc";
import { BsPlayFill } from "react-icons/bs";

/**
 * YouTube "facade" — iframe yalnızca tıklandığında yüklenir.
 * react-player yerine bu yaklaşım sayfa açılışında ~200 KB JS ve
 * üçüncü taraf istek tasarrufu sağlar; LCP ve TBT doğrudan iyileşir.
 */
const VideoPopup = ({ videoKey, title, thumbnail, className = "", children }) => {
    const [open, setOpen] = useState(false);

    if (!videoKey) return null;

    return (
        <>
            <button
                type="button"
                className={className || "videoThumb"}
                onClick={() => setOpen(true)}
                aria-label={`${title} — fragmanı oynat`}
            >
                {children || (
                    <>
                        <Image
                            src={thumbnail || `https://i.ytimg.com/vi/${videoKey}/hqdefault.jpg`}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 60vw, 300px"
                            className="videoThumbImg"
                        />
                        <span className="playIcon" aria-hidden="true">
                            <BsPlayFill />
                        </span>
                        <span className="videoThumbTitle">{title}</span>
                    </>
                )}
            </button>

            {open && (
                <div
                    className="videoPopup"
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    onClick={() => setOpen(false)}
                >
                    <button
                        type="button"
                        className="videoClose"
                        onClick={() => setOpen(false)}
                        aria-label="Kapat"
                    >
                        <VscChromeClose />
                    </button>
                    <div className="videoFrame" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoPopup;
