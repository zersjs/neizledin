"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const SORT_OPTIONS = [
    { value: "popularity.desc", label: "Popülerlik" },
    { value: "vote_average.desc", label: "En yüksek puan" },
    { value: "primary_release_date.desc", label: "En yeni" },
    { value: "primary_release_date.asc", label: "En eski" },
    { value: "vote_count.desc", label: "En çok oylanan" },
];

/**
 * Keşfet filtreleri. react-select yerine yerel <select> —
 * bundle'a kütüphane eklemez, mobilde işletim sisteminin kendi
 * seçicisini açar ve JS olmadan da form olarak çalışır.
 *
 * Seçimler URL'e yazılır; böylece filtreli görünüm paylaşılabilir olur.
 */
const Filters = ({ genres = [] }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const update = (key, value) => {
        const next = new URLSearchParams(params.toString());
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete("sayfa");
        const qs = next.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const activeGenre = params.get("tur") || "";
    const activeSort = params.get("sirala") || "popularity.desc";

    return (
        <div className="filters">
            <label className="filterField">
                <span className="srOnly">Tür seç</span>
                <select value={activeGenre} onChange={(e) => update("tur", e.target.value)}>
                    <option value="">Tüm türler</option>
                    {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="filterField">
                <span className="srOnly">Sıralama</span>
                <select value={activeSort} onChange={(e) => update("sirala", e.target.value)}>
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </label>

            {(activeGenre || params.get("sirala")) && (
                <button
                    type="button"
                    className="btnQuiet filterClear"
                    onClick={() => router.push(pathname, { scroll: false })}
                >
                    Temizle
                </button>
            )}
        </div>
    );
};

export default Filters;
