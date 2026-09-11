import { SITE } from "@/lib/seo";

export default function manifest() {
    return {
        name: SITE.name,
        short_name: SITE.shortName,
        description: SITE.description,
        start_url: "/",
        display: "standalone",
        background_color: "#14181C",
        theme_color: "#14181C",
        lang: "tr-TR",
        dir: "ltr",
        categories: ["entertainment", "social", "lifestyle"],
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
        ],
        shortcuts: [
            {
                name: "Ne izledin?",
                short_name: "Kaydet",
                description: "İzlediğin yapımı kaydet",
                url: "/?kaydet=1",
            },
            {
                name: "Akış",
                url: "/akis",
            },
        ],
    };
}
