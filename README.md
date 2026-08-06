# ne izledin?

> Ekran kapandı, sohbet başladı.

İzlediğin film ve dizileri kaydettiğin, puanladığın ve yorumladığın Türkçe sosyal
izleme platformu. Arkadaşlarının ne izlediğini görürsün, her bölümden sonra
tartışmaya katılırsın.

**İzlediklerin kaybolmasın.**

---

## Konumlandırma

Bu bir yayın platformu ya da film veritabanı değil. Merkezinde yapımlar değil,
**insanların izleme deneyimi** var. Ana sayfada afiş duvarı yerine tek bir soru
durur: _Bugün ne izledin?_

## Teknoloji

| Katman | Seçim | Neden |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | SSR + metadata API — SEO'nun ön koşulu |
| Dil | JavaScript (JSX) | Mevcut yapıdan devralındı |
| Stil | Sass, bileşenle birlikte `style.scss` | Kütüphane yok, tam kontrol |
| Veri | TMDB API (`tr-TR`) | Sunucu tarafında, anahtar tarayıcıya inmez |
| Görsel | `next/image` | Otomatik AVIF/WebP + tembel yükleme |
| İkon | `react-icons` | |

Redux, axios, react-router, react-select, react-player ve lazy-load kütüphaneleri
kaldırıldı; işlevleri Next.js'in kendi araçlarıyla veya birkaç satır kodla
karşılanıyor.

## Kurulum

```bash
npm install
```

Proje kökünde `.env.local` oluştur:

```
TMDB_API_KEY=senin_tmdb_v3_anahtarin
NEXT_PUBLIC_SITE_URL=https://neizledin.com
```

```bash
npm run dev
```

http://localhost:3000

## Komutlar

| Komut | İş |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm start` | Derlenmiş uygulamayı çalıştır |
| `npm run lint` | ESLint |

## Rota yapısı

Tüm rotalar Türkçe ve slug tabanlı — `/movie/123` yerine `/film/severance-95396`.

| Rota | Sayfa |
| --- | --- |
| `/` | Ana sayfa — "Bugün ne izledin?" |
| `/film/[slug]` | Film detayı |
| `/dizi/[slug]` | Dizi detayı |
| `/kisi/[slug]` | Oyuncu / yönetmen |
| `/kesfet/filmler` · `/kesfet/diziler` | Keşfet, filtreli ve sayfalı |
| `/ara?q=` | Arama sonuçları |
| `/akis` | Sosyal akış |
| `/listeler` | Editör seçkileri |
| `/profil/[kullanici]` | İzleme günlüğü |

Eski Vite rotaları (`/movie/:id`, `/explore/movie`, `/search/:query`)
`next.config.mjs` içinde 301 ile yeni adreslere yönlendirilir.

## SEO

Frontend baştan arama motoru odaklı kuruldu:

- **Sunucuda render** — tüm içerik ilk HTML'de; kartlar `onClick` değil gerçek `<a>`
- **`generateMetadata`** her sayfada; benzersiz başlık, açıklama, canonical
- **JSON-LD**: `WebSite` + `SearchAction`, `Organization`, `Movie`, `TVSeries`,
  `Person`, `BreadcrumbList`, `ItemList`, `FAQPage`, `AggregateRating`, `VideoObject`
- **Türkçe slug'lar** — `ş/ğ/ı/ö/ç/ü` ASCII'ye çevrilir, kimlik sona eklenir
- **Kanonik slug zorlaması** — yanlış slug tek doğru adrese 301
- **`sitemap.xml`** dinamik, ~200 yapım + statik rotalar; **`robots.txt`** kurallı
- **Sayfalama gerçek bağlantılarla** — sonsuz kaydırma yok, katalog taranabilir
- **Dizine alınmayanlar**: arama sonuçları, filtrelenmiş keşfet görünümleri
- **Dinamik OG görselleri** `next/og` ile üretilir
- **Core Web Vitals**: YouTube facade (iframe sadece tıklayınca yüklenir),
  `next/font` ile yerel font, `append_to_response` ile tek TMDB isteği

## Marka

| Kullanım | Renk |
| --- | --- |
| Gece siyahı (zemin) | `#090A0C` |
| Koyu füme (kart) | `#14161A` |
| Grafit (yükseltilmiş) | `#1D2025` |
| Kırık beyaz (yazı) | `#F5F5F2` |
| Gri (ikincil yazı) | `#9A9DA4` |
| **Elektrik limon (marka)** | **`#C9FF3D`** |
| Yumuşak kırmızı | `#FF5C5C` |
| Açık mavi | `#68A7FF` |

Arayüzün yaklaşık %85'i siyah, füme ve beyaz; %15'i vurgu rengi. Logo tamamen
tipografik — film şeridi, klaket, kamera, patlamış mısır yok. Soru işareti
markanın sembolü ve her zaman limon yeşili.

## Durum

Frontend tamam. Sosyal katman (akış, tartışma, profil, uyumluluk, günün sorusu)
şu an `src/lib/mock.js` içindeki örnek veriyle çalışıyor — bileşenlerin aldığı
prop şekli backend hazır olduğunda değişmeyecek şekilde tasarlandı.

Sırada backend var.

## Veri kaynağı

Film ve dizi verileri [TMDB](https://www.themoviedb.org/) tarafından sağlanır.
Bu ürün TMDB tarafından onaylanmamıştır veya sertifikalandırılmamıştır.
