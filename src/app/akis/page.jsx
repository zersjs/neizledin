import ContentWrapper from "@/components/contentWrapper/ContentWrapper";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import FeedCard from "@/components/feedCard/FeedCard";
import SwitchTabs from "@/components/switchTabs/SwitchTabs";
import Compatibility from "@/components/compatibility/Compatibility";
import DailyQuestion from "@/components/dailyQuestion/DailyQuestion";
import { getTrending } from "@/lib/tmdb";
import { COMPATIBILITY, FEED } from "@/lib/mock";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Akış — Arkadaşların bugün ne izledi?",
    description:
        "Takip ettiklerinin izlediği film ve diziler, verdikleri puanlar ve yazdıkları yorumlar tek akışta.",
    path: "/akis",
});

export default async function FeedPage({ searchParams }) {
    const sp = await searchParams;
    const scope = sp?.kapsam === "herkes" ? "herkes" : "takip";
    const trending = await getTrending("week");

    return (
        <div className="pageShell feedPage">
            <ContentWrapper>
                <Breadcrumbs
                    items={[{ name: "Ana sayfa", href: "/" }, { name: "Akış" }]}
                />

                <div className="feedPageHead">
                    <h1 className="pageTitle">Akış</h1>
                    <SwitchTabs
                        ariaLabel="Akış kapsamı"
                        tabs={[
                            {
                                label: "Takip ettiklerim",
                                href: "/akis",
                                active: scope === "takip",
                            },
                            {
                                label: "Herkes",
                                href: "/akis?kapsam=herkes",
                                active: scope === "herkes",
                            },
                        ]}
                    />
                </div>

                <div className="feedLayout">
                    <div className="feedMain">
                        <div className="feedList">
                            {FEED.map((item) => (
                                <FeedCard key={item.id} item={item} />
                            ))}
                        </div>

                        <p className="feedEnd">
                            Şimdilik bu kadar. Sen bugün ne izledin
                            <span className="q">?</span>
                        </p>
                    </div>

                    <aside className="feedAside" aria-label="Yan panel">
                        <Compatibility data={COMPATIBILITY} />
                    </aside>
                </div>
            </ContentWrapper>

            <DailyQuestion posters={trending?.results || []} />
        </div>
    );
}
