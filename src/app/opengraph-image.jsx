import { ImageResponse } from "next/og";

export const alt = "Ne İzledin? — Ekran kapandı, sohbet başladı.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Varsayılan paylaşım görseli.
 * Sosyal medyada paylaşılan her bağlantı markanın tipografisini taşısın diye
 * statik dosya yerine burada üretiliyor.
 */
export default async function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#14181C",
                    padding: "72px 80px",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Marka renginden hafif bir ışık */}
                <div
                    style={{
                        position: "absolute",
                        top: -260,
                        left: -160,
                        width: 700,
                        height: 700,
                        borderRadius: 9999,
                        background: "rgba(0, 224, 84, 0.10)",
                        display: "flex",
                    }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 800,
                            color: "#DFE6EE",
                            letterSpacing: "-0.045em",
                        }}
                    >
                        ne izledin
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 800,
                            color: "#00E054",
                            letterSpacing: "-0.045em",
                        }}
                    >
                        ?
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontSize: 92,
                            fontWeight: 800,
                            color: "#DFE6EE",
                            letterSpacing: "-0.045em",
                            lineHeight: 1.05,
                            display: "flex",
                        }}
                    >
                        Bugün ne izledin
                        <span style={{ color: "#00E054" }}>?</span>
                    </div>
                    <div
                        style={{
                            marginTop: 24,
                            fontSize: 34,
                            color: "#99AABB",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Ekran kapandı, sohbet başladı.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 24,
                        color: "#7A8899",
                    }}
                >
                    <span>neizledin.com</span>
                    <span>İzlediklerin kaybolmasın.</span>
                </div>
            </div>
        ),
        size
    );
}
