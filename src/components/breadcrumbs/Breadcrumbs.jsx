import Link from "next/link";

import { breadcrumbSchema, jsonLd } from "@/lib/seo";

/**
 * Kırıntı navigasyonu. Hem kullanıcıya konum bilgisi verir,
 * hem de BreadcrumbList şemasıyla arama sonuçlarında site yapısını gösterir.
 */
const Breadcrumbs = ({ items }) => (
    <>
        <nav className="breadcrumbs" aria-label="Sayfa yolu">
            <ol>
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={`${item.name}-${i}`}>
                            {isLast || !item.href ? (
                                <span aria-current={isLast ? "page" : undefined}>
                                    {item.name}
                                </span>
                            ) : (
                                <Link href={item.href}>{item.name}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(items))}
        />
    </>
);

export default Breadcrumbs;
