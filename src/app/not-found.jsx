import Link from "next/link";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import SearchBox from "@/components/searchBox/SearchBox";

export const metadata = {
    title: "Aradığın sahne kesilmiş olabilir",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className="pageShell notFoundPage">
            <ContentWrapper>
                <p className="notFoundCode" aria-hidden="true">
                    404
                </p>
                <h1>
                    Aradığın sahne kesilmiş olabilir<span className="q">.</span>
                </h1>
                <p className="lead">
                    Bu adreste bir şey bulamadık. Aramayı denemek ister misin?
                </p>

                <div className="notFoundSearch">
                    <SearchBox />
                </div>

                <div className="notFoundLinks">
                    <Link href="/" className="btn btnPrimary">
                        Ana sayfaya dön
                    </Link>
                    <Link href="/kesfet/filmler" className="btn btnGhost">
                        Filmleri keşfet
                    </Link>
                    <Link href="/kesfet/diziler" className="btn btnGhost">
                        Dizilere göz at
                    </Link>
                </div>
            </ContentWrapper>
        </div>
    );
}
