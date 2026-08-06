"use client";

import ContentWrapper from "@/components/contentWrapper/ContentWrapper";

export default function Error({ reset }) {
    return (
        <div className="pageShell notFoundPage">
            <ContentWrapper>
                <p className="notFoundCode" aria-hidden="true">
                    500
                </p>
                <h1>
                    Projeksiyon bozuldu<span className="q">.</span>
                </h1>
                <p className="lead">Birazdan yeniden deneyelim.</p>

                <div className="notFoundLinks">
                    <button type="button" className="btn btnPrimary" onClick={() => reset()}>
                        Tekrar dene
                    </button>
                </div>
            </ContentWrapper>
        </div>
    );
}
