import Link from "next/link";

/**
 * Sekmeler istemci state'i yerine gerçek bağlantı.
 * Her sekmenin kendi URL'i olduğu için içerik sunucuda basılır,
 * taranabilir ve paylaşılabilir olur.
 */
const SwitchTabs = ({ tabs, ariaLabel = "Görünüm seç" }) => (
    <div className="switchingTabs" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => (
            <Link
                key={tab.href}
                href={tab.href}
                role="tab"
                aria-selected={tab.active}
                scroll={false}
                className={`tabItem ${tab.active ? "active" : ""}`}
            >
                {tab.label}
            </Link>
        ))}
    </div>
);

export default SwitchTabs;
