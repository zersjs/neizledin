"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Logo from "../logo/Logo";

const NAV = [
    { href: "/akis", label: "Akış" },
    { href: "/kesfet/filmler", label: "Filmler" },
    { href: "/kesfet/diziler", label: "Diziler" },
    { href: "/listeler", label: "Listeler" },
];

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");

    const pathname = usePathname();
    const router = useRouter();

    // Rota değişince açık panelleri kapat
    useEffect(() => {
        setMobileMenu(false);
        setShowSearch(false);
    }, [pathname]);

    const controlNavbar = useCallback(() => {
        const y = window.scrollY;
        if (y > 200) {
            setShow(y > lastScrollY && !mobileMenu ? "hide" : "show");
        } else {
            setShow("top");
        }
        setLastScrollY(y);
    }, [lastScrollY, mobileMenu]);

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar, { passive: true });
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [controlNavbar]);

    const submitSearch = (event) => {
        event.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/ara?q=${encodeURIComponent(q)}`);
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch((prev) => !prev);
    };

    const openMobileMenu = () => {
        setShowSearch(false);
        setMobileMenu((prev) => !prev);
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper className="headerBar">
                <Logo size="sm" />

                <nav className="menuItems" aria-label="Ana menü">
                    <ul>
                        {NAV.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`menuItem ${
                                        pathname.startsWith(item.href) ? "active" : ""
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="headerActions">
                    <button
                        type="button"
                        className="iconBtn"
                        onClick={openSearch}
                        aria-label="Ara"
                        aria-expanded={showSearch}
                    >
                        <HiOutlineSearch />
                    </button>

                    <Link href="/profil/resul" className="btn btnPrimary headerCta">
                        Ne izledin?
                    </Link>

                    <button
                        type="button"
                        className="iconBtn mobileOnly"
                        onClick={openMobileMenu}
                        aria-label={mobileMenu ? "Menüyü kapat" : "Menüyü aç"}
                        aria-expanded={mobileMenu}
                    >
                        {mobileMenu ? <VscChromeClose /> : <SlMenu />}
                    </button>
                </div>
            </ContentWrapper>

            {mobileMenu && (
                <nav className="mobileMenu" aria-label="Mobil menü">
                    <ContentWrapper>
                        <ul>
                            {NAV.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href}>{item.label}</Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/profil/resul">Profilim</Link>
                            </li>
                        </ul>
                    </ContentWrapper>
                </nav>
            )}

            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <form className="searchInput" onSubmit={submitSearch} role="search">
                            <HiOutlineSearch className="searchIcon" aria-hidden="true" />
                            <input
                                type="search"
                                name="q"
                                autoFocus
                                value={query}
                                placeholder="Film veya dizi ara…"
                                aria-label="Film veya dizi ara"
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btnPrimary">
                                Ara
                            </button>
                            <button
                                type="button"
                                className="iconBtn"
                                onClick={() => setShowSearch(false)}
                                aria-label="Aramayı kapat"
                            >
                                <VscChromeClose />
                            </button>
                        </form>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
