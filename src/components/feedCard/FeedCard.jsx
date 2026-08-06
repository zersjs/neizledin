import Link from "next/link";
import { HiOutlineHeart, HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

import Stars from "../rating/Stars";
import SpoilerText from "./SpoilerText";
import { episodeCode, timeAgo } from "@/lib/format";

const ACTION_LABEL = {
    watched: "izledi",
    dropped: "yarıda bıraktı",
    listed: "liste oluşturdu",
};

/**
 * Akıştaki tek bir olay.
 * Merkezde yapım değil, insanın izleme deneyimi var — konumlandırmanın özü bu.
 */
const FeedCard = ({ item }) => {
    const { user, action, title, episode, list, rating, comment, spoiler } = item;
    const initial = user.displayName.charAt(0).toLocaleUpperCase("tr-TR");

    return (
        <article className="feedCard">
            <Link href={`/profil/${user.username}`} className="feedAvatar" aria-hidden="true">
                {initial}
            </Link>

            <div className="feedBody">
                <p className="feedLine">
                    <Link href={`/profil/${user.username}`} className="feedUser">
                        {user.displayName}
                    </Link>{" "}
                    {title ? (
                        <>
                            <Link href={`/${title.type}/${title.slug}`} className="feedTitle">
                                {title.name}
                            </Link>{" "}
                            {episode && (
                                <span className="feedEpisode">
                                    {episodeCode(episode.season, episode.episode)}
                                </span>
                            )}{" "}
                            <span className="feedAction">{ACTION_LABEL[action]}.</span>
                        </>
                    ) : (
                        <>
                            <Link href={`/listeler/${list.slug}`} className="feedTitle">
                                {list.name}
                            </Link>{" "}
                            <span className="feedAction">
                                {ACTION_LABEL[action]} · {list.count} yapım
                            </span>
                        </>
                    )}
                </p>

                {rating > 0 && (
                    <div className="feedRating">
                        <Stars value={rating} size={14} />
                    </div>
                )}

                {comment &&
                    (spoiler ? (
                        <SpoilerText>{comment}</SpoilerText>
                    ) : (
                        <p className="feedComment">{comment}</p>
                    ))}

                <div className="feedFoot">
                    <button type="button" className="feedAction feedBtn">
                        <HiOutlineHeart aria-hidden="true" />
                        <span>{item.likes}</span>
                        <span className="srOnly">beğeni</span>
                    </button>
                    <button type="button" className="feedAction feedBtn">
                        <HiOutlineChatBubbleOvalLeft aria-hidden="true" />
                        <span>{item.replies}</span>
                        <span className="srOnly">yanıt</span>
                    </button>
                    <time dateTime={item.at} className="feedTime">
                        {timeAgo(item.at)}
                    </time>
                </div>
            </div>
        </article>
    );
};

export default FeedCard;
