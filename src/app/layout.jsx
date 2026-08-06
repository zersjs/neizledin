import { Inter } from "next/font/google";

import "./globals.scss";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BottomNav from "@/components/bottomNav/BottomNav";
import { SITE, jsonLd, organizationSchema, websiteSchema } from "@/lib/seo";

// next/font fontu kendi sunucumuzdan servis eder:
// harici istek yok, layout shift yok, gizlilik sorunu yok.
const inter = Inter({
    subsets: ["latin", "latin-ext"], // latin-ext = Türkçe karakterler
    display: "swap",
    variable: "--font-sans",
});

export const metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: `${SITE.name} — ${SITE.tagline}`,
        template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.name,
    keywords: [
        "film yorumları",
        "dizi yorumları",
        "izleme günlüğü",
        "film puanlama",
        "dizi tartışma",
        "ne izlesem",
        "film önerileri",
        "dizi önerileri",
    ],
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: {
        canonical: "/",
        languages: { "tr-TR": "/" },
    },
    openGraph: {
        type: "website",
        locale: SITE.locale,
        url: SITE.url,
        siteName: SITE.name,
        title: `${SITE.name} — ${SITE.tagline}`,
        description: SITE.description,
    },
    twitter: {
        card: "summary_large_image",
        site: SITE.twitter,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    formatDetection: { telephone: false },
    manifest: "/manifest.webmanifest",
};

export const viewport = {
    themeColor: "#090A0C",
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={inter.variable}>
            <head>
                {/* TMDB görselleri ilk ekranda kullanıldığı için bağlantı erkenden açılır */}
                <link rel="preconnect" href="https://image.tmdb.org" />
                <link rel="dns-prefetch" href="https://image.tmdb.org" />
            </head>
            <body>
                <a href="#icerik" className="skipLink">
                    İçeriğe geç
                </a>

                <Header />

                <main id="icerik">{children}</main>

                <Footer />
                <BottomNav />

                {/* Site geneli şemalar — her sayfada bir kez */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={jsonLd(websiteSchema())}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={jsonLd(organizationSchema())}
                />
            </body>
        </html>
    );
}
