"use client";

import { useState } from "react";
import { HiOutlineHeart } from "react-icons/hi2";

import { timeAgo } from "@/lib/format";

/**
 * Yapım tartışması: spoilersız ve spoilerlı alanlar ayrı.
 * Spoilerlı alana geçerken kullanıcıya izleyip izlemediği sorulur —
 * platformun en belirleyici güven mekanizması.
 */
const Discussion = ({ clean = [], spoiler = [], titleName, episodeLabel }) => {
    const [tab, setTab] = useState("clean");
    const [confirmed, setConfirmed] = useState(false);

    const list = tab === "clean" ? clean : spoiler;
    const gated = tab === "spoiler" && !confirmed;

    return (
        <section className="discussion" aria-labelledby="tartisma">
            <div className="sectionHeading">
                <h2 id="tartisma" className="heading">
                    Tartışma
                    {episodeLabel && <span className="discussionEp"> · {episodeLabel}</span>}
                </h2>
            </div>

            <div className="switchingTabs" role="tablist" aria-label="Tartışma alanı">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "clean"}
                    className={`tabItem ${tab === "clean" ? "active" : ""}`}
                    onClick={() => setTab("clean")}
                >
                    Spoilersız
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "spoiler"}
                    className={`tabItem ${tab === "spoiler" ? "active" : ""}`}
                    onClick={() => setTab("spoiler")}
                >
                    Spoilerlı
                </button>
            </div>

            {gated ? (
                <div className="spoilerGate">
                    <p className="gateTitle">
                        Bu alanda her şey konuşuluyor<span className="q">.</span>
                    </p>
                    <p className="gateSub">
                        {episodeLabel
                            ? `${titleName} ${episodeLabel} bölümünü izledin mi?`
                            : `${titleName} yapımını izledin mi?`}
                    </p>
                    <div className="gateActions">
                        <button
                            type="button"
                            className="btn btnPrimary"
                            onClick={() => setConfirmed(true)}
                        >
                            İzledim, göster
                        </button>
                        <button
                            type="button"
                            className="btn btnGhost"
                            onClick={() => setTab("clean")}
                        >
                            Henüz izlemedim
                        </button>
                    </div>
                </div>
            ) : list.length ? (
                <ul className="commentList">
                    {list.map((c) => (
                        <li key={c.id} className="comment">
                            <span className="commentAvatar" aria-hidden="true">
                                {c.user.displayName.charAt(0).toLocaleUpperCase("tr-TR")}
                            </span>
                            <div>
                                <p className="commentHead">
                                    <strong>{c.user.displayName}</strong>
                                    <time dateTime={c.at}>{timeAgo(c.at)}</time>
                                </p>
                                <p className="commentBody">{c.body}</p>
                                <button type="button" className="commentLike">
                                    <HiOutlineHeart aria-hidden="true" />
                                    <span>{c.likes}</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="emptyState">
                    <div className="emoji" aria-hidden="true">
                        💬
                    </div>
                    <p className="title">Burada henüz kimse konuşmamış.</p>
                    <p>İlk yorumu sen yaz.</p>
                </div>
            )}
        </section>
    );
};

export default Discussion;
