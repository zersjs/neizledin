import "server-only";

/**
 * Sinemalar.com haber kazıyıcısı.
 *
 * Haberler şu an canlı olarak sinemalar.com'dan çekiliyor; kendi haber
 * altyapımız yok. Kaynağı yormamak için cevaplar ISR ile önbelleklenir
 * (robots.txt bazı botlar için crawl-delay istiyor) ve her sayfada
 * kaynağa görünür atıf + orijinal habere bağlantı verilir.
 *
 * Kırılganlık notu: kazıma, kaynağın HTML'ine bağlıdır. Sinemalar.com
 * şablonunu değiştirirse buradaki desenler güncellenmelidir; parse
 * başarısız olursa sayfa boş liste döner, çökmez.
 */

export const NEWS_SOURCE = {
    name: "Sinemalar",
    url: "https://www.sinemalar.com",
    listPath: "/sinemahaberleri",
};

/** Haber detayları birebir kaynağın metni olduğu için dizine açılmaz.
 *  Kendi editoryal içeriğimiz olduğunda true yapılabilir. */
export const NEWS_INDEXABLE = false;

const LIST_REVALIDATE = 900; // 15 dk
const ITEM_REVALIDATE = 3600; // 1 sa

// Kaynaktaki sayfalayıcı bu civarda bitiyor; sonsuz taramayı engeller.
export const MAX_PAGE = 260;

const TR_MONTHS = [
    "ocak", "şubat", "mart", "nisan", "mayıs", "haziran",
    "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık",
];

/* ============================================================ yardımcılar */

async function fetchSource(path, revalidate) {
    const res = await fetch(`${NEWS_SOURCE.url}${path}`, {
        headers: {
            // Kim olduğumuzu saklamıyoruz
            "User-Agent":
                "NeIzledinBot/1.0 (+https://neizledin.com; haber özeti)",
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "tr-TR,tr;q=0.9",
        },
        next: { revalidate },
    });

    if (!res.ok) return null;
    return res.text();
}

const ENTITIES = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
    hellip: "…", ndash: "–", mdash: "—",
};

/** &#039; ve &amp; gibi kaçışları çözer */
export function decodeEntities(text = "") {
    return String(text)
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
            String.fromCharCode(parseInt(code, 16))
        )
        .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

/** Etiketleri atıp düz metne indirger */
function stripTags(html = "") {
    return decodeEntities(String(html).replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
}

function getAttr(attrs = "", name) {
    const match = attrs.match(
        new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i")
    );
    return match ? decodeEntities(match[2] ?? match[3] ?? "") : "";
}

/** Sadece http(s) ve site içi yollara izin verir — javascript:, data: engellenir */
function safeUrl(raw = "") {
    const url = String(raw).trim();
    if (/^https?:\/\//i.test(url)) return url;
    // Protokolsüz adres (//host/yol) kaynağın yolu değil, ayrı bir alan adıdır
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `${NEWS_SOURCE.url}${url}`;
    return "";
}

/** "07.08.2026" -> "2026-08-07" */
function isoFromDots(value = "") {
    const m = String(value).match(/(\d{2})\.(\d{2})\.(\d{4})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/** "07 Ağustos 2026 12:05" -> "2026-08-07T12:05:00+03:00" */
function isoFromTurkish(value = "") {
    const m = String(value).match(
        /(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})(?:\s+(\d{2}):(\d{2}))?/
    );
    if (!m) return "";
    const month = TR_MONTHS.indexOf(m[2].toLocaleLowerCase("tr"));
    if (month < 0) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const date = `${m[3]}-${pad(month + 1)}-${pad(m[1])}`;
    return m[4] ? `${date}T${m[4]}:${m[5]}:00+03:00` : date;
}

/* =========================================================== temizleyici */

// Beyaz liste dışındaki her etiket düşer, içindeki metin kalır.
const ALLOWED_TAGS = new Set([
    "p", "h2", "h3", "h4", "strong", "b", "em", "i",
    "ul", "ol", "li", "blockquote", "a", "br", "figure", "figcaption", "img",
]);
const VOID_TAGS = new Set(["br", "img"]);

/**
 * Kaynaktan gelen gövdeyi `dangerouslySetInnerHTML` ile basacağımız için
 * sıkı bir beyaz listeden geçirir: izin verilmeyen etiketler ve *tüm*
 * öznitelikler atılır, geriye yalnızca yeniden kurduğumuz güvenli
 * öznitelikler kalır. Böylece on* olayları ve javascript: adresleri kalamaz.
 */
export function sanitizeArticleHtml(html = "") {
    let out = String(html);

    // Çalıştırılabilir ve gömülü blokları içeriğiyle birlikte sil
    out = out.replace(
        /<(script|style|iframe|object|embed|form|noscript|svg|video|audio)\b[\s\S]*?<\/\1\s*>/gi,
        ""
    );
    out = out.replace(/<!--[\s\S]*?-->/g, "");
    // Reklam kapsayıcıları
    out = out.replace(/<div[^>]*\bclass="[^"]*\bad\b[^"]*"[\s\S]*?<\/div>/gi, "");

    out = out.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, slash, rawName, attrs) => {
        const name = rawName.toLowerCase();
        if (!ALLOWED_TAGS.has(name)) return "";
        if (slash) return VOID_TAGS.has(name) ? "" : `</${name}>`;

        if (name === "a") {
            const href = safeUrl(getAttr(attrs, "href"));
            // Güvenli adres yoksa etiketi boş bırak — kapanışla eşleşme bozulmasın
            if (!href) return "<a>";
            return `<a href="${href}" target="_blank" rel="noopener noreferrer nofollow">`;
        }

        if (name === "img") {
            const src = safeUrl(getAttr(attrs, "src"));
            if (!src) return "";
            const alt = getAttr(attrs, "alt").replace(/"/g, "");
            return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
        }

        return `<${name}>`;
    });

    // Boşalan paragrafları temizle
    out = out.replace(/<p>(\s|&nbsp;|<br>)*<\/p>/gi, "");
    return out.trim();
}

/* ================================================================ liste */

/**
 * Haber listesi. `page` 1'den başlar ve kaynağın ?page parametresiyle birebir
 * eşleşir (page=0 ile page=1 aynı ilk sayfayı verir).
 */
export async function getNewsList(page = 1) {
    const safePage = Math.max(1, Math.min(Number(page) || 1, MAX_PAGE));
    const html = await fetchSource(
        `${NEWS_SOURCE.listPath}${safePage > 1 ? `?page=${safePage}` : ""}`,
        LIST_REVALIDATE
    );
    if (!html) return { items: [], page: safePage, hasNext: false };

    const items = [];
    const seen = new Set();
    const cardRe =
        /<a\s+class="card content-card"\s+href="([^"]*\/haber\/(\d+)\/([^"/?#]+))"[^>]*>([\s\S]*?)<\/a>/g;

    let match;
    while ((match = cardRe.exec(html)) !== null) {
        const [, , id, sourceSlug, body] = match;
        if (seen.has(id)) continue;
        seen.add(id);

        const title = decodeEntities(
            body.match(/<h3[^>]*class="card-title"[^>]*>([\s\S]*?)<\/h3>/)?.[1] || ""
        )
            .replace(/<[^>]*>/g, "")
            .trim();

        items.push({
            id,
            sourceSlug,
            slug: `${sourceSlug}-${id}`,
            title,
            excerpt: stripTags(
                body.match(/<div[^>]*class="card-excerpt"[^>]*>([\s\S]*?)<\/div>/)?.[1] || ""
            ),
            image: safeUrl(getAttr(body.match(/<img[^>]*>/)?.[0] || "", "src")),
            date: isoFromDots(
                stripTags(
                    body.match(/<div[^>]*class="card-info"[^>]*>([\s\S]*?)<\/div>/)?.[1] || ""
                )
            ),
        });
    }

    return {
        items: items.filter((item) => item.title),
        page: safePage,
        // Sonraki sayfayı uydurmak yerine kaynağın sayfalayıcısına bak
        hasNext:
            items.length > 0 &&
            safePage < MAX_PAGE &&
            html.includes(`?page=${safePage + 1}"`),
    };
}

/* =============================================================== detay */

/** Tek haber. `slug` bizim rotamızdaki "baslik-slug-13968" biçimidir. */
export async function getNewsArticle(id, sourceSlug) {
    if (!id || !sourceSlug) return null;

    const html = await fetchSource(`/haber/${id}/${sourceSlug}`, ITEM_REVALIDATE);
    if (!html) return null;

    const title = decodeEntities(
        html.match(/<div class="page-title">\s*<h1>\s*([\s\S]*?)\s*<\/h1>/)?.[1] ||
            html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ||
            ""
    ).trim();

    if (!title) return null;

    const rawBody =
        html.match(/<article class="text-content">([\s\S]*?)<\/article>/)?.[1] || "";

    const dateText = stripTags(
        html.match(/<div class="header-meta">([\s\S]*?)<\/div>/)?.[1] || ""
    );

    return {
        id,
        sourceSlug,
        slug: `${sourceSlug}-${id}`,
        title,
        dateText,
        date: isoFromTurkish(dateText),
        image: safeUrl(
            html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] || ""
        ),
        description: decodeEntities(
            html.match(/<meta name="description" content="([^"]*)"/)?.[1] || ""
        ).trim(),
        contentHtml: sanitizeArticleHtml(rawBody),
        sourceUrl: `${NEWS_SOURCE.url}/haber/${id}/${sourceSlug}`,
    };
}

/** "baslik-13968" -> { id: "13968", sourceSlug: "baslik" } */
export function parseNewsSlug(slug = "") {
    const match = String(slug).match(/^(.*)-(\d+)$/);
    if (!match) return { id: null, sourceSlug: null };
    return { id: match[2], sourceSlug: match[1] };
}
