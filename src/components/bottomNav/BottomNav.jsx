"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineHome, HiOutlineSearch } from "react-icons/hi";
import { HiOutlineQueueList, HiOutlineUser } from "react-icons/hi2";

import LogSheet from "../logSheet/LogSheet";

const LEFT = [
    { href: "/akis", label: "Akış", Icon: HiOutlineHome },
    { href: "/kesfet/filmler", label: "Keşfet", Icon: HiOutlineSearch },
];

const RIGHT = [
    { href: "/listeler", label: "Listeler", Icon: HiOutlineQueueList },
    { href: "/profil/resul", label: "Profil", Icon: HiOutlineUser },
];

/**
 * Mobil alt navigasyon. Ortadaki soru işareti doğrudan
 * "Ne izledin?" kayıt ekranını açar — günlük alışkanlığın giriş noktası.
 */
const BottomNav = () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const pathname = usePathname();

    const item = ({ href, label, Icon }) => (
        <Link
            key={href}
            href={href}
            className={`navItem ${pathname.startsWith(href) ? "active" : ""}`}
        >
            <Icon aria-hidden="true" />
            <span>{label}</span>
        </Link>
    );

    return (
        <>
            <nav className="bottomNav" aria-label="Alt menü">
                {LEFT.map(item)}

                <button
                    type="button"
                    className="navLog"
                    onClick={() => setSheetOpen(true)}
                    aria-label="Ne izledin? Kayıt ekranını aç"
                >
                    <span aria-hidden="true">?</span>
                </button>

                {RIGHT.map(item)}
            </nav>

            <LogSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
        </>
    );
};

export default BottomNav;
