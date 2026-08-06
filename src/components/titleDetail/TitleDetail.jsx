import Image from "next/image";
import Link from "next/link";
import { BsPlayFill } from "react-icons/bs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Rating from "../rating/Rating";
import Genres from "../genres/Genres";
import Poster from "../poster/Poster";
import PersonRow from "../personRow/PersonRow";
import Carousel from "../carousel/Carousel";
import Discussion from "../discussion/Discussion";
import VideoPopup from "../videoPopup/VideoPopup";
import LogCta from "./LogCta";

import { IMG } from "@/lib/tmdb";
import { count, runtime as fmtRuntime, trDate, year } from "@/lib/format";
import { DISCUSSIONS } from "@/lib/mock";

const CREW_JOBS = {
    Director: "Yönetmen",
    Screenplay: "Senaryo",
    Story: "Hikâye",
    Writer: "Yazar",
};

const STATUS_TR = {
    Released: "Yayınlandı",
    "Post Production": "Post prodüksiyon",
    "In Production": "Yapım aşamasında",
    Planned: "Planlanıyor",
    Rumored: "Söylenti",
    Canceled: "İptal edildi",
    "Returning Series": "Devam ediyor",
    Ended: "Tamamlandı",
};

const TitleDetail = ({ data, mediaType, genreMap }) => {
    const isMovie = mediaType === "movie";
    const name = data.title || data.name;
    const originalName = data.original_title || data.original_name;
    const date = data.release_date || data.first_air_date;
    const y = year(date);
    const backdrop = IMG.backdrop(data.backdrop_path, "w1280");

    const videos = (data.videos?.results || []).filter((v) => v.site === "YouTube");
    const trailer =
        videos.find((v) => v.type === "Trailer") || videos.find((v) => v.type === "Teaser");

    const crew = data.credits?.crew || [];
    const directors = crew.filter((c) => c.job === "Director");
    const writers = crew.filter((c) => CREW_JOBS[c.job] && c.job !== "Director");

    // Türkiye'de hangi platformlarda var?
    const providers = data["watch/providers"]?.results?.TR;
    const streaming = providers?.flatrate || [];

    const infoRows = [
        data.status && { label: "Durum", value: STATUS_TR[data.status] || data.status },
        date && { label: isMovie ? "Vizyon tarihi" : "İlk yayın", value: trDate(date) },
        isMovie && data.runtime && { label: "Süre", value: fmtRuntime(data.runtime) },
        !isMovie &&
            data.number_of_seasons && {
                label: "Sezon",
                value: `${data.number_of_seasons} sezon · ${data.number_of_episodes} bölüm`,
            },
        data.original_language && {
            label: "Orijinal dil",
            value: data.original_language.toUpperCase(),
        },
        directors.length && {
            label: directors.length > 1 ? "Yönetmenler" : "Yönetmen",
            value: directors.map((d) => d.name).join(", "),
        },
        writers.length && {
            label: "Senaryo",
            value: [...new Set(writers.map((w) => w.name))].slice(0, 4).join(", "),
        },
        data.created_by?.length && {
            label: "Yaratıcı",
            value: data.created_by.map((c) => c.name).join(", "),
        },
    ].filter(Boolean);

    return (
        <>
            {/* ------------------------------------------------------- banner */}
            <article className="titleDetail">
                <div className="detailsBanner">
                    {backdrop && (
                        <div className="backdropImg">
                            <Image
                                src={backdrop}
                                alt=""
                                fill
                                priority
                                sizes="100vw"
                                className="backdropPic"
                            />
                        </div>
                    )}
                    <div className="opacityLayer" />

                    <ContentWrapper>
                        <Breadcrumbs
                            items={[
                                { name: "Ana sayfa", href: "/" },
                                {
                                    name: isMovie ? "Filmler" : "Diziler",
                                    href: isMovie ? "/kesfet/filmler" : "/kesfet/diziler",
                                },
                                { name },
                            ]}
                        />

                        <div className="detailsContent">
                            <div className="detailsLeft">
                                <div className="detailsPoster">
                                    <Poster
                                        path={data.poster_path}
                                        alt={`${name} afişi`}
                                        sizes="(max-width: 768px) 45vw, 300px"
                                        priority
                                    />
                                </div>
                            </div>

                            <div className="detailsRight">
                                <h1 className="detailsTitle">
                                    {name}
                                    {y && <span className="detailsYear"> ({y})</span>}
                                </h1>

                                {originalName && originalName !== name && (
                                    <p className="detailsOriginal">
                                        Orijinal adı: {originalName}
                                    </p>
                                )}

                                {data.tagline && (
                                    <p className="detailsTagline">{data.tagline}</p>
                                )}

                                <Genres data={data.genres} limit={5} size="lg" />

                                <div className="detailsRow">
                                    <div className="detailsScore">
                                        <Rating rating={data.vote_average} size={54} />
                                        <div className="detailsScoreMeta">
                                            <strong>İzleyici puanı</strong>
                                            <span>{count(data.vote_count)} oy</span>
                                        </div>
                                    </div>

                                    {trailer && (
                                        <VideoPopup
                                            videoKey={trailer.key}
                                            title={`${name} fragman`}
                                            className="playBtn"
                                        >
                                            <span className="playRing" aria-hidden="true">
                                                <BsPlayFill />
                                            </span>
                                            <span>Fragmanı izle</span>
                                        </VideoPopup>
                                    )}
                                </div>

                                {data.overview && (
                                    <div className="detailsOverview">
                                        <h2>Konusu</h2>
                                        <p lang={data.overview_lang || undefined}>
                                            {data.overview}
                                        </p>
                                        {data.overview_lang === "en" && (
                                            <p className="overviewNote">
                                                Türkçe özet henüz eklenmemiş.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <LogCta name={name} />

                                <dl className="detailsInfo">
                                    {infoRows.map((row) => (
                                        <div key={row.label} className="infoItem">
                                            <dt>{row.label}</dt>
                                            <dd>{row.value}</dd>
                                        </div>
                                    ))}
                                </dl>

                                {streaming.length > 0 && (
                                    <div className="providers">
                                        <h2>Türkiye’de nerede var?</h2>
                                        <ul>
                                            {streaming.map((p) => (
                                                <li key={p.provider_id}>
                                                    <Image
                                                        src={IMG.profile(p.logo_path, "w92")}
                                                        alt={p.provider_name}
                                                        width={38}
                                                        height={38}
                                                    />
                                                    <span>{p.provider_name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="providersNote">
                                            Yayın bilgileri JustWatch üzerinden gelir ve
                                            değişebilir.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ContentWrapper>
                </div>
            </article>

            {/* ------------------------------------------------------ alt bölümler */}
            <ContentWrapper>
                <PersonRow people={data.credits?.cast} title="Oyuncular" />

                {videos.length > 0 && (
                    <section className="videosSection" aria-labelledby="videolar">
                        <div className="sectionHeading">
                            <h2 id="videolar" className="heading">
                                Fragmanlar ve videolar
                            </h2>
                        </div>
                        <div className="videoList">
                            {videos.slice(0, 8).map((v) => (
                                <VideoPopup key={v.id} videoKey={v.key} title={v.name} />
                            ))}
                        </div>
                    </section>
                )}

                <Discussion
                    titleName={name}
                    clean={DISCUSSIONS.clean}
                    spoiler={DISCUSSIONS.spoiler}
                    episodeLabel={!isMovie ? "S01E01" : null}
                />
            </ContentWrapper>

            <Carousel
                title="Benzer yapımlar"
                items={(data.similar?.results || []).slice(0, 20)}
                mediaType={mediaType}
                genreMap={genreMap}
            />

            <Carousel
                title="Bunu izleyenler şunu da izledi"
                items={(data.recommendations?.results || []).slice(0, 20)}
                mediaType={mediaType}
                genreMap={genreMap}
            />

            <ContentWrapper>
                <p className="detailsFootNote">
                    <Link href={`/kesfet/${isMovie ? "filmler" : "diziler"}`}>
                        Daha fazla {isMovie ? "film" : "dizi"} keşfet
                    </Link>
                    {" · "}
                    <Link href="/akis">Bugün neler konuşuluyor?</Link>
                </p>
            </ContentWrapper>
        </>
    );
};

export default TitleDetail;
