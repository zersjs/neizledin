"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

/**
 * Yalnızca kaydırma davranışını üstlenir; içerideki kartlar sunucuda
 * render edilip children olarak geçer. Böylece tarayıcıya JS inmeden önce
 * de tüm bağlantılar HTML'de hazır bulunur.
 */
const CarouselScroller = ({ children }) => {
    const ref = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const sync = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 8);
        setAtEnd(el.scrollLeft + el.offsetWidth >= el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        sync();
        const el = ref.current;
        if (!el) return;
        el.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        return () => {
            el.removeEventListener("scroll", sync);
            window.removeEventListener("resize", sync);
        };
    }, [sync]);

    const scroll = (dir) => {
        const el = ref.current;
        if (!el) return;
        const step = el.offsetWidth * 0.8;
        el.scrollTo({
            left: dir === "left" ? el.scrollLeft - step : el.scrollLeft + step,
            behavior: "smooth",
        });
    };

    return (
        <div className="carouselViewport">
            <button
                type="button"
                className="carouselNav carouselNav--left"
                onClick={() => scroll("left")}
                disabled={atStart}
                aria-label="Geri kaydır"
            >
                <BsChevronLeft />
            </button>

            <div className="carouselItems" ref={ref}>
                {children}
            </div>

            <button
                type="button"
                className="carouselNav carouselNav--right"
                onClick={() => scroll("right")}
                disabled={atEnd}
                aria-label="İleri kaydır"
            >
                <BsChevronRight />
            </button>
        </div>
    );
};

export default CarouselScroller;
