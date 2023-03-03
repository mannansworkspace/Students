import { FC, useContext, useEffect } from "react";
import Bookmark from "assets/img/bookmark.svg";
import EmptyBookmark from "assets/img/bookmark-icon.svg";
import Highlighter from "assets/img/highlighter.svg";
import { QuestionnaireContext } from "./QuestionnaireContext";
import Cookies from "js-cookie";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ClearModal from "./models/ClearModal";
import PauseExitModal from "./models/PauseExitModal";
import FinishModal from "./models/FinishModal";
import Choice from "./Choice";
import SpeechControls from './SpeechControls'
import BasicCalculator from "./BasicCalculator";
import { setMarkings } from "util/RaphaelInit";
import HtmlParser from './HtmlParser'
import UnAvailableTestModal from "./models/UnAvailableTest";
import AssesmentScoreModal from "common/Modals/AssesmentScoreModal";

interface Props {
    onRemoveHighlighter: () => void
}
const QuestionContainer: FC<Props> = (props) => {
    const { onRemoveHighlighter } = props
    const assessmentName = Cookies.get('assessmentName');
    const isTextToSpeech = Cookies.get("text_to_speech_enabled") === "true";
    const {
        currentQuestion,
        questionIdx,
        onChange,
        tabIndex,
        setTabIndex,
        isHighlighterActive,
        onSpeak,
        isSpeechIconClicked,
        isPausedByTeacher,
        showCalculator,
        keyToSpeak,
        containerRef
    } = useContext(QuestionnaireContext);

    useEffect(() => {
        const divElement = document.getElementById("question")?.querySelector('div')
        if (divElement && divElement.style?.maxWidth?.length) {
            divElement.style.maxWidth = "unset"
        }
    }, [currentQuestion])

    useEffect(() => {

        const { penMarkings } = currentQuestion
        setMarkings(penMarkings)

        return () => {
            onRemoveHighlighter();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionIdx])

    if (!currentQuestion.id) {
        return null;
    }

    const {
        passage_directions,
        direction,
        passage_1,
        passage_2,
        question,
        choice_1,
        choice_2,
        choice_3,
        choice_4,
        bookMarked,
    } = currentQuestion;

    const hasTabs = !(passage_1 || passage_2)

    return (
        <div className="mainContent" id="highlight" >
            {isPausedByTeacher && (
                <div>
                    <div className="mainContent-backDrop"></div>
                    <div className="mainContent-alert loading">
                        <p>Assessment has been paused by instructor <span>.</span><span>.</span><span>.</span></p>
                    </div>
                </div>
            )}
            <div className={`mainContent-header ${hasTabs ? "changing-width" : ""}`}>
                <div className="mainContent-header-empty"></div>
                <ClearModal />
                <PauseExitModal />
                <FinishModal />
                <UnAvailableTestModal />
                <AssesmentScoreModal />


                <div className="mainContent-header-wrapper">
                    <div
                        className={`mainContent__answer ${hasTabs ? "changing-width" : ""}`}
                    >
                        <div className="mainContent__answer-content">
                            <div className="mainContent__answer-paragraph">
                                {assessmentName}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`mainContent__question ${hasTabs ? "changing-width" : ""
                            }`}
                    >
                        <div className="mainContent__question-content">
                            <p className="mainContent__question-paragraph">
                                {bookMarked ?
                                    <img src={Bookmark} alt="bookmark" onClick={() => onChange('bookMarked', false)} />
                                    :
                                    <img src={EmptyBookmark} alt="bookmark" onClick={() => onChange('bookMarked', true)} />
                                }
                                {`Question ${questionIdx + 1}`}
                            </p>
                        </div>
                        {isTextToSpeech && (
                            <SpeechControls />
                        )}
                    </div>
                </div>

                <div className="mainContent-header-empty"></div>
            </div>

            <div ref={containerRef} style={{ cursor: isHighlighterActive ? `url(${Highlighter}) 0 35, move` : 'auto' }} className={`mainContent__main ${hasTabs ? "switch-off-column" : ""}`}>
                <div
                    style={{ display: 'contents' }}
                >
                    {!hasTabs && (
                        <div className={`answers`}>
                            <div className={`answers-content`}>
                                {passage_2 ?
                                    <Tabs
                                        selectedIndex={tabIndex}
                                        onSelect={(index: number, _: any, event: any) => {
                                            const id = (event.target as Element).getAttribute("data-id");
                                            id !== "delete-icon" && setTabIndex(index);
                                        }}
                                    >
                                        <TabList>
                                            <Tab>Tab 1</Tab>
                                            <Tab>Tab 2</Tab>
                                        </TabList>

                                        <div className="answers__editor math-editor">
                                            <div
                                                className={`answers__editor-tab ${isSpeechIconClicked && 'ondemandtts'} ${keyToSpeak === "passage_directions" && 'playtts'}`}
                                                onClick={() => onSpeak('passage_directions')}
                                            >
                                                <span className="answers__editor-instructions">
                                                    <HtmlParser html={passage_directions} id="passage_directions" />
                                                </span>
                                            </div>
                                            <div
                                                onClick={() => onSpeak('passage_1')}
                                                className={`answers__editor-edit ${isSpeechIconClicked && 'ondemandtts'}`}
                                            >
                                                <TabPanel>
                                                    <div className={`zoomAnimation  ${isSpeechIconClicked && 'tts'}`}>
                                                        <HtmlParser html={passage_1} id="passage_1" />
                                                    </div>
                                                </TabPanel>
                                            </div>
                                            <div
                                                onClick={() => onSpeak('passage_2')}
                                                className={`answers__editor-edit ${isSpeechIconClicked && 'ondemandtts'}`}
                                            >
                                                <TabPanel>
                                                    <div className={`zoomAnimation  ${isSpeechIconClicked && 'tts'}`}>
                                                        <HtmlParser html={passage_2} id="passage_2" />
                                                    </div>
                                                </TabPanel>
                                            </div>
                                        </div>
                                    </Tabs>
                                    :
                                    <div className="answers__editor">
                                        <div className="zoomAnimation">
                                            <div
                                                className={`answers__editor-tab ${isSpeechIconClicked && 'ondemandtts'}  ${keyToSpeak === "passage_directions" && 'playtts'}`}
                                                onClick={() => onSpeak('passage_directions')}
                                            >
                                                <span className="answers__editor-instructions p-0">
                                                    <HtmlParser html={passage_directions} id="passage_directions" />
                                                </span>
                                            </div>

                                            <div
                                                className={`answers__editor-edit ${isSpeechIconClicked && 'tts'}`}
                                            >
                                                <HtmlParser html={passage_1} id="passage_1" />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    )}
                    <div className={`questions ${hasTabs ? "switch-off-column" : ""}`}>
                        <div className="questions-wrapper">
                            <div className="questions__question">
                                {
                                    direction && <div className="questions__dialogue"
                                        onClick={() => onSpeak('direction')}
                                    >
                                        <p className={`${isSpeechIconClicked && 'ondemandtts'} ${keyToSpeak === "direction" && 'playtts'}`}><HtmlParser html={direction} id="direction" /></p>
                                    </div>
                                }
                                <div
                                    id="chr-ques"
                                    className="questions__question-item instruction"
                                >
                                    <div className={`${isSpeechIconClicked && 'ondemandtts'} ${keyToSpeak === "question" && 'playtts'} questions__question-instruction`}
                                        onClick={() => onSpeak('question')}
                                    >
                                        <HtmlParser html={question} id="question" />
                                    </div>
                                </div>

                                <div className="questions__question-item">
                                    <Choice
                                        choice="A"
                                        choiceText={choice_1}
                                        option={0}
                                    />

                                </div>
                                <div className="questions__question-item choice-b">
                                    <Choice
                                        choice="B"
                                        choiceText={choice_2}
                                        option={1}
                                    />

                                </div>
                                <div className="questions__question-item choice-c">
                                    <Choice
                                        choice="C"
                                        choiceText={choice_3}
                                        option={2}
                                    />
                                </div>
                                <div className="questions__question-item choice-d">
                                    <Choice
                                        choice="D"
                                        choiceText={choice_4}
                                        option={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        showCalculator && <BasicCalculator />
                    }
                </div>
            </div>
        </div>

    );
};
export default QuestionContainer;
