import Link from "next/link";
import { FaInstagram, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Logo from "../logo/Logo";

const COLUMNS = [
    {
        title: "Keşfet",
        links: [
            { href: "/kesfet/filmler", label: "Filmler" },
            { href: "/kesfet/diziler", label: "Diziler" },
            { href: "/haberler", label: "Haberler" },
            { href: "/listeler", label: "Listeler" },
            { href: "/akis", label: "Akış" },
        ],
    },
    {
        title: "Topluluk",
        links: [
            { href: "/akis", label: "Bugün ne konuşuluyor?" },
            { href: "/listeler", label: "Editör seçkileri" },
            { href: "/profil/resul", label: "İzleme günlüğüm" },
        ],
    },
    {
        title: "Kurumsal",
        links: [
            { href: "/hakkinda", label: "Hakkında" },
            { href: "/kullanim-kosullari", label: "Kullanım koşulları" },
            { href: "/gizlilik", label: "Gizlilik" },
            { href: "/iletisim", label: "İletişim" },
        ],
    },
];

const SOCIAL = [
    { href: "https://instagram.com/neizledin", label: "Instagram", Icon: FaInstagram },
    { href: "https://x.com/neizledin", label: "X", Icon: FaXTwitter },
    { href: "https://tiktok.com/@neizledin", label: "TikTok", Icon: FaTiktok },
    { href: "https://youtube.com/@neizledin", label: "YouTube", Icon: FaYoutube },
];

const Footer = () => (
    <footer className="footer">
        <ContentWrapper>
            <div className="footerTop">
                <div className="footerBrand">
                    <Logo size="md" />
                    <p className="footerTagline">Ekran kapandı, sohbet başladı.</p>
                    <div className="socialIcons">
                        {SOCIAL.map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                className="icon"
                                aria-label={label}
                                rel="me noopener noreferrer"
                                target="_blank"
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>

                <nav className="footerNav" aria-label="Alt bilgi menüsü">
                    {COLUMNS.map((col) => (
                        <div key={col.title} className="footerCol">
                            <h2>{col.title}</h2>
                            <ul>
                                {col.links.map((link) => (
                                    <li key={link.href + link.label}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="footerBottom">
                <p>
                    © {new Date().getFullYear()} Ne İzledin? — İzlediklerin kaybolmasın.
                </p>
                <p className="attribution">
                    Film ve dizi verileri{" "}
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TMDB
                    </a>{" "}
                    tarafından sağlanmaktadır. Ne İzledin? bir yayın platformu değildir.
                </p>
            </div>
        </ContentWrapper>
    </footer>
);

export default Footer;
