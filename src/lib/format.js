const TR_MONTHS = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
];

/** "2025-03-21" -> "21 Mart 2025" */
export function trDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getUTCDate()} ${TR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2025-03-21" -> "2025" */
export function year(value) {
    if (!value) return "";
    const y = String(value).slice(0, 4);
    return /^\d{4}$/.test(y) ? y : "";
}

/** 142 -> "2 sa 22 dk" */
export function runtime(minutes) {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} dk`;
    return m ? `${h} sa ${m} dk` : `${h} sa`;
}

/** ISO 8601 süre — schema.org duration alanı bunu ister */
export function isoDuration(minutes) {
    if (!minutes) return undefined;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}

/** 8.437 -> "8,4" (Türkçe ondalık ayracı virgül) */
export function score(vote) {
    if (!vote && vote !== 0) return "–";
    return (Math.round(vote * 10) / 10).toFixed(1).replace(".", ",");
}

/** 10 üzerinden puanı 5 yıldıza indirger */
export function toStars(vote) {
    return Math.round((vote / 2) * 2) / 2;
}

/** 12345 -> "12.345" */
export function count(n) {
    if (!n && n !== 0) return "0";
    return new Intl.NumberFormat("tr-TR").format(n);
}

/** Göreli zaman: "3 saat önce" */
export function timeAgo(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);

    if (diff < 60) return "az önce";
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
    return trDate(value);
}

/** Meta description için metni cümle sınırında keser */
export function clamp(text, max = 155) {
    if (!text) return "";
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max);
    const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
    if (lastStop > max * 0.6) return cut.slice(0, lastStop + 1);
    return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** "S02E07" */
export function episodeCode(season, episode) {
    const pad = (n) => String(n).padStart(2, "0");
    return `S${pad(season)}E${pad(episode)}`;
}
