import ContentWrapper from "../contentWrapper/ContentWrapper";
import BackdropCollage from "../backdropCollage/BackdropCollage";
import AnswerBox from "./AnswerBox";
import { questionOfTheDay } from "@/lib/mock";

/**
 * Günün sorusu. Kullanıcı o gün hiçbir şey izlemese bile
 * siteye dönmesi için bir sebep — günlük döngünün çekirdeği.
 */
const DailyQuestion = ({ posters = [] }) => {
    const question = questionOfTheDay();

    return (
        <section className="dailyQuestion" aria-labelledby="gununSorusu">
            <ContentWrapper>
                <div className="dqCard hasCollage">
                    <BackdropCollage items={posters} variant="card" />
                    <span className="badge badgeBrand">Günün sorusu</span>
                    <h2 id="gununSorusu">{question}</h2>
                    <AnswerBox />
                    <p className="dqMeta">
                        Bugün <strong>1.284</strong> kişi cevapladı.
                    </p>
                </div>
            </ContentWrapper>
        </section>
    );
};

export default DailyQuestion;
