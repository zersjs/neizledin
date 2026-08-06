"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSearch } from "react-icons/hi";

/**
 * Ana sayfadaki büyük arama alanı.
 * JS yüklenmese bile çalışsın diye gerçek bir <form action="/ara">.
 */
const SearchBox = ({ defaultValue = "", placeholder = "Film veya dizi ara…", autoFocus = false }) => {
    const [query, setQuery] = useState(defaultValue);
    const router = useRouter();

    const submit = (event) => {
        event.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/ara?q=${encodeURIComponent(q)}`);
    };

    return (
        <form className="searchBox" action="/ara" method="get" onSubmit={submit} role="search">
            <HiOutlineSearch className="searchBoxIcon" aria-hidden="true" />
            <input
                type="search"
                name="q"
                value={query}
                autoFocus={autoFocus}
                placeholder={placeholder}
                aria-label="Film veya dizi ara"
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btnPrimary">
                Ara
            </button>
        </form>
    );
};

export default SearchBox;
