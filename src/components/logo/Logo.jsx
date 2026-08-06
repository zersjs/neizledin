import Link from "next/link";

/**
 * Marka logosu tamamen tipografik — film şeridi, klaket, kamera yok.
 * Ayırt edici parça soru işareti; her zaman limon yeşili.
 */
const Logo = ({ size = "md", href = "/", as = "link" }) => {
    const content = (
        <span className={`logo logo--${size}`}>
            <span className="logo__word">ne izledin</span>
            <span className="logo__mark" aria-hidden="true">
                ?
            </span>
        </span>
    );

    if (as === "text") return content;

    return (
        <Link href={href} className="logoLink" aria-label="Ne İzledin? ana sayfa">
            {content}
        </Link>
    );
};

export default Logo;
