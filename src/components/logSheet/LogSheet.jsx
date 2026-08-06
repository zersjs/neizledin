"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VscChromeClose } from "react-icons/vsc";
import { HiOutlineSearch } from "react-icons/hi";

import StarInput from "../rating/StarInput";

const EMPTY = {
    rating: 0,
    comment: "",
    spoiler: false,
    watchedAt: "",
    favorite: false,
};

/**
 * "Ne izledin?" kayıt ekranı.
 * Backend yazılana kadar gönderim yerel; alanlar ve akış birebir kalacak.
 */
const LogSheet = ({ open, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [picked, setPicked] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saved, setSaved] = useState(false);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef(null);

    // Panel açıkken arkadaki sayfa kaymasın
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        inputRef.current?.focus();

        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    // Kapanınca durumu sıfırla
    useEffect(() => {
        if (open) return;
        const t = setTimeout(() => {
            setQuery("");
            setResults([]);
            setPicked(null);
            setForm(EMPTY);
            setSaved(false);
        }, 200);
        return () => clearTimeout(t);
    }, [open]);

    // Yazarken arama — 300 ms bekleyip tek istek at
    useEffect(() => {
        const q = query.trim();
        if (q.length < 2 || picked) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        setSearching(true);

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/ara?q=${encodeURIComponent(q)}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                setResults(data.results || []);
            } catch {
                /* istek iptal edildi */
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, picked]);

    if (!open) return null;

    const submit = (event) => {
        event.preventDefault();
        setSaved(true);
    };

    return (
        <div className="sheetOverlay" onClick={onClose} role="presentation">
            <div
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Ne izledin?"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sheetHandle" aria-hidden="true" />

                <div className="sheetHead">
                    <h2>
                        Ne izledin<span className="q">?</span>
                    </h2>
                    <button
                        type="button"
                        className="iconBtn"
                        onClick={onClose}
                        aria-label="Kapat"
                    >
                        <VscChromeClose />
                    </button>
                </div>

                {saved ? (
                    <div className="sheetDone">
                        <div className="doneMark" aria-hidden="true">
                            ✓
                        </div>
                        <p className="doneTitle">Bir akşam buna ayrıldı.</p>
                        <p className="doneSub">
                            Yorumun yayında. Arkadaşların akışta görecek.
                        </p>
                        <button type="button" className="btn btnPrimary" onClick={onClose}>
                            Tamam
                        </button>
                    </div>
                ) : !picked ? (
                    <div className="sheetSearch">
                        <label className="searchField">
                            <HiOutlineSearch aria-hidden="true" />
                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                placeholder="Film veya dizi ara…"
                                aria-label="Kaydedeceğin yapımı ara"
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </label>

                        {searching && <p className="hint">Aranıyor…</p>}

                        {!searching && query.trim().length >= 2 && !results.length && (
                            <p className="hint">
                                Bulamadık. Adını başka türlü yazmayı dener misin?
                            </p>
                        )}

                        <ul className="pickList">
                            {results.map((item) => (
                                <li key={`${item.mediaType}-${item.id}`}>
                                    <button type="button" onClick={() => setPicked(item)}>
                                        <span className="pickPoster">
                                            {item.poster ? (
                                                <Image
                                                    src={item.poster}
                                                    alt=""
                                                    width={46}
                                                    height={69}
                                                />
                                            ) : (
                                                <span className="pickPosterEmpty">?</span>
                                            )}
                                        </span>
                                        <span className="pickMeta">
                                            <strong>{item.name}</strong>
                                            <small>
                                                {item.mediaType === "movie" ? "Film" : "Dizi"}
                                                {item.year ? ` · ${item.year}` : ""}
                                            </small>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <form className="sheetForm" onSubmit={submit}>
                        <div className="pickedTitle">
                            {picked.poster && (
                                <Image
                                    src={picked.poster}
                                    alt=""
                                    width={54}
                                    height={81}
                                    className="pickedPoster"
                                />
                            )}
                            <div>
                                <strong>{picked.name}</strong>
                                <small>
                                    {picked.mediaType === "movie" ? "Film" : "Dizi"}
                                    {picked.year ? ` · ${picked.year}` : ""}
                                </small>
                            </div>
                            <button
                                type="button"
                                className="btnQuiet"
                                onClick={() => setPicked(null)}
                            >
                                Değiştir
                            </button>
                        </div>

                        <div className="field">
                            <span className="fieldLabel">Puanın</span>
                            <StarInput
                                value={form.rating}
                                onChange={(rating) => setForm({ ...form, rating })}
                            />
                        </div>

                        <div className="field">
                            <label className="fieldLabel" htmlFor="logComment">
                                Kısa yorum
                            </label>
                            <textarea
                                id="logComment"
                                rows={3}
                                maxLength={280}
                                value={form.comment}
                                placeholder="Bir cümle yeter. Ne hissettin?"
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            />
                            <span className="counter">{form.comment.length}/280</span>
                        </div>

                        <div className="field">
                            <label className="fieldLabel" htmlFor="logDate">
                                İzleme tarihi
                            </label>
                            <input
                                id="logDate"
                                type="date"
                                value={form.watchedAt}
                                onChange={(e) => setForm({ ...form, watchedAt: e.target.value })}
                            />
                        </div>

                        <label className="checkRow">
                            <input
                                type="checkbox"
                                checked={form.spoiler}
                                onChange={(e) => setForm({ ...form, spoiler: e.target.checked })}
                            />
                            <span>Spoiler içeriyor</span>
                        </label>

                        <label className="checkRow">
                            <input
                                type="checkbox"
                                checked={form.favorite}
                                onChange={(e) => setForm({ ...form, favorite: e.target.checked })}
                            />
                            <span>Favorilerime ekle</span>
                        </label>

                        <button type="submit" className="btn btnPrimary sheetSubmit">
                            Kaydet
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LogSheet;
