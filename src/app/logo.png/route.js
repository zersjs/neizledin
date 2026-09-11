import { ImageResponse } from "next/og";

export const revalidate = false;

/**
 * schema.org Organization.logo alanı raster görsel bekler.
 * Ayrı bir dosya tutmak yerine markanın soru işaretini burada PNG olarak üretiyoruz.
 */
export function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#14181C",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: 340,
                        fontWeight: 800,
                        color: "#00E054",
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        marginTop: -30,
                    }}
                >
                    ?
                </div>
            </div>
        ),
        { width: 512, height: 512 }
    );
}
