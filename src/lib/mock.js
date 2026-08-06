/**
 * Backend yazılana kadar sosyal katmanın örnek verisi.
 * Tamamı deterministik — SSR ve hydration arasında fark oluşmasın diye
 * hiçbir yerde Math.random() ya da new Date() kullanılmıyor.
 *
 * Backend hazır olduğunda bu dosyanın yerini API çağrıları alacak;
 * bileşenlerin aldığı prop şekli aynı kalacak şekilde tasarlandı.
 */

export const CURRENT_USER = {
    username: "resul",
    displayName: "Resul",
    avatar: null,
    bio: "Gece yarısı gerilim izleyip sabaha kadar teori okuyan adam.",
    joinedAt: "2026-01-14",
    stats: {
        thisWeekEpisodes: 4,
        thisMonthMovies: 7,
        totalHours: 312,
        topGenre: "Gerilim",
        topActor: "Adam Scott",
        averageScore: 3.8,
        followers: 184,
        following: 213,
    },
};

export const FEED = [
    {
        id: "f1",
        user: { username: "ahmet", displayName: "Ahmet" },
        action: "watched",
        title: { name: "Severance", slug: "severance-95396", type: "dizi" },
        episode: { season: 2, episode: 7 },
        rating: 4.5,
        comment: "Finalden sonra yarım saat ekrana baktım.",
        spoiler: false,
        likes: 42,
        replies: 11,
        at: "2026-08-06T19:20:00.000Z",
    },
    {
        id: "f2",
        user: { username: "zeynep", displayName: "Zeynep" },
        action: "watched",
        title: { name: "Dune: Part Two", slug: "dune-part-two-693134", type: "film" },
        rating: 5,
        comment:
            "Sinemada ikinci kez izledim, ses tasarımı tek başına bilet parası ediyor.",
        spoiler: false,
        likes: 128,
        replies: 24,
        at: "2026-08-06T16:05:00.000Z",
    },
    {
        id: "f3",
        user: { username: "mert", displayName: "Mert" },
        action: "dropped",
        title: { name: "The Idol", slug: "the-idol-125988", type: "dizi" },
        episode: { season: 1, episode: 3 },
        comment: "Üçüncü bölümde bıraktım. Kimse üzerine alınmasın.",
        spoiler: false,
        likes: 9,
        replies: 3,
        at: "2026-08-06T11:40:00.000Z",
    },
    {
        id: "f4",
        user: { username: "elif", displayName: "Elif" },
        action: "listed",
        list: { name: "Tek oturuşta bitenler", count: 12, slug: "tek-oturusta-bitenler" },
        likes: 61,
        replies: 7,
        at: "2026-08-05T21:12:00.000Z",
    },
    {
        id: "f5",
        user: { username: "can", displayName: "Can" },
        action: "watched",
        title: { name: "Oppenheimer", slug: "oppenheimer-872585", type: "film" },
        rating: 4,
        comment:
            "Üç saat sürüyor ama bir sahnesini bile atlayamazsın. Yine de o final tartışmalı.",
        spoiler: true,
        likes: 77,
        replies: 31,
        at: "2026-08-05T09:00:00.000Z",
    },
];

/** Profil sayfasındaki izleme günlüğü */
export const DIARY = [
    { date: "2026-08-06", name: "Severance", type: "dizi", slug: "severance-95396", episode: "S02E07", rating: 4.5 },
    { date: "2026-08-04", name: "Poor Things", type: "film", slug: "poor-things-792307", rating: 4 },
    { date: "2026-08-03", name: "Shogun", type: "dizi", slug: "shogun-726015", episode: "S01E09", rating: 5 },
    { date: "2026-08-01", name: "Past Lives", type: "film", slug: "past-lives-666277", rating: 4.5 },
    { date: "2026-07-30", name: "The Bear", type: "dizi", slug: "the-bear-136315", episode: "S03E04", rating: 3.5 },
    { date: "2026-07-28", name: "Anatomy of a Fall", type: "film", slug: "anatomy-of-a-fall-915935", rating: 4 },
];

/** Tartışma odaları — spoilersız / spoilerlı ayrı */
export const DISCUSSIONS = {
    clean: [
        {
            id: "d1",
            user: { username: "burcu", displayName: "Burcu" },
            body: "İlk bölümü izleyip bırakmayın, üçüncüden sonra tamamen başka bir şeye dönüşüyor.",
            likes: 34,
            at: "2026-08-04T18:00:00.000Z",
        },
        {
            id: "d2",
            user: { username: "kaan", displayName: "Kaan" },
            body: "Görüntü yönetmeni kim bilen var mı? Her karesi duvara asılır.",
            likes: 12,
            at: "2026-08-03T13:30:00.000Z",
        },
    ],
    spoiler: [
        {
            id: "d3",
            user: { username: "ahmet", displayName: "Ahmet" },
            body: "O son sahnedeki asansör planı bence tüm sezonun cevabıydı ve kimse konuşmuyor.",
            likes: 58,
            at: "2026-08-05T22:10:00.000Z",
        },
    ],
};

/** Uyumluluk kartı örneği */
export const COMPATIBILITY = {
    with: { username: "zeynep", displayName: "Zeynep" },
    score: 87,
    shared: ["Severance", "The Bear", "Past Lives"],
    conflicts: [
        { name: "Oppenheimer", you: 4, them: 2 },
        { name: "The Idol", you: 1, them: 3.5 },
    ],
};

/** Günün sorusu — gün numarasına göre deterministik seçilir */
export const DAILY_QUESTIONS = [
    "Sizi en çok şaşırtan final hangisiydi?",
    "Herkesin sevip sizin sevmediğiniz film?",
    "Tekrar tekrar izlediğiniz dizi?",
    "En iyi kötü karakter?",
    "Bir filmi tek bir sahnesi için izlediniz mi?",
    "Finali tüm diziyi mahveden yapım hangisi?",
    "Yılın en çok konuşulan ama en az hak edilen yapımı?",
];

/** Sunucuda ve istemcide aynı sonucu vermesi için gün indeksinden seçer. */
export function questionOfTheDay(date = new Date()) {
    const dayIndex = Math.floor(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    ) / 86400000);
    return DAILY_QUESTIONS[dayIndex % DAILY_QUESTIONS.length];
}

/** Ana sayfadaki SSS bloğu — hem kullanıcı hem arama motoru için */
export const HOME_FAQ = [
    {
        q: "Ne İzledin? nedir?",
        a: "Ne İzledin?, izlediğin film ve dizileri kaydettiğin, puanladığın ve yorumladığın Türkçe sosyal izleme platformudur. Arkadaşlarının ne izlediğini görür, her bölümden sonra tartışmalara katılırsın.",
    },
    {
        q: "Ne İzledin? ücretli mi?",
        a: "Hayır. İzleme günlüğü tutmak, puan vermek, yorum yazmak ve liste oluşturmak tamamen ücretsizdir.",
    },
    {
        q: "Film veya dizi izleyebilir miyim?",
        a: "Hayır, Ne İzledin? bir yayın platformu değildir. İzlediklerini kaydettiğin ve konuştuğun bir topluluk platformudur. Yapımların hangi platformlarda bulunduğunu ilgili sayfada görebilirsin.",
    },
    {
        q: "Spoiler'dan nasıl korunuyorum?",
        a: "Her yapımın tartışma alanı spoilersız ve spoilerlı olarak ikiye ayrılır. Spoilerlı alana girmeden önce ilgili bölümü izleyip izlemediğin sorulur, yorumlar da varsayılan olarak gizli gelir.",
    },
    {
        q: "Letterboxd'dan verilerimi taşıyabilir miyim?",
        a: "İçe aktarma özelliği üzerinde çalışıyoruz. Yayına alındığında izleme geçmişini ve puanlarını tek dosyayla taşıyabileceksin.",
    },
];
