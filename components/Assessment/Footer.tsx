/*eslint-disable*/
import { FC, useContext, useEffect, useState } from "react";
import { QuestionnaireContext } from './QuestionnaireContext';
import { ReactComponent as Highlighter } from "assets/img/highlighter.svg";
import Eraser from "assets/img/eraser.svg";
import Calculator from "assets/img/calculator.svg";
import RedMarker from 'assets/img/red-marker.svg';
import Cookies from "js-cookie";
import { initDrawing, bindDrawing, unbindDrawing, eraseDrawing } from 'util/RaphaelInit'

interface Props {
    onClickHighLighter: (setIsScreenMarked: Function) => void
    onRemoveHighlighter: () => void;
    onDestroyHighlighter: () => void;
}


const Footer: FC<Props> = (props): JSX.Element => {
    const { questionIdx, setIsScreenMarked, setIsPencilActive, isPausedByTeacher, isPencilActive, setIsHighlighterActive, isHighlighterActive, setShowCalculator, showCalculator, setShowFinishModal, hasPreviousQuestion, hasNextQuestion, previousQuestion, nextQuestion, currentQuestion, setShowClearModal, setShowPauseExitModal, questions } = useContext(QuestionnaireContext);

    const isCalculatorAllowed = Cookies.get('allow_calculator') === "true";
    const isMath = Cookies.get('isMath') === "true";
    const { isScreenMarked } = currentQuestion

    const [enableEraser, setEnableEraser] = useState(false)

    useEffect(() => {
        console.log({ questionIdx }, { isScreenMarked })
        setEnableEraser(isScreenMarked)
    }, [questionIdx])

    useEffect(() => {
        console.log({ enableEraser })
        if (enableEraser && !isScreenMarked) {
            setIsScreenMarked(true)
        }
    }, [enableEraser])

    useEffect(() => {
        initDrawing();
    }, [])

    useEffect(() => {
        if (isPencilActive) {
            bindDrawing(setEnableEraser)
        } else {

            unbindDrawing()
        }
    }, [isPencilActive, setEnableEraser])

    useEffect(() => {
        if (!isHighlighterActive) {
            props.onDestroyHighlighter();
        }
        else {
            props.onClickHighLighter(setEnableEraser);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHighlighterActive])

    const onClickHighlighter = () => {
        setIsHighlighterActive(!isHighlighterActive);
        setIsPencilActive(false);
    }

    const onClickEraser = () => {
        setIsScreenMarked(false);
        setEnableEraser(false)
        eraseDrawing()
        props.onRemoveHighlighter();
    }

    const onClickPencil = () => {
        setIsPencilActive(!isPencilActive);
        setIsHighlighterActive(false);
    }

    const onClickCalculator = () => {
        setShowCalculator(!showCalculator);
        setIsHighlighterActive(false);
        setIsPencilActive(false);
    }

    const clearPencil = () => {
        setIsPencilActive(false);
        setIsHighlighterActive(false);
    }
    return (
        <footer className="cmsFooter">
            <div className="pg-container">
                <div className="cmsFooter-wrapper">
                    <div className="cmsFooter__search"
                        style={{ position: 'relative' }}
                    >
                        <span
                            className={`cmsFooter__highlighter footer-size ${isHighlighterActive ? 'footer__tools-border' : ''}`}
                        >
                            <Highlighter

                                style={{ cursor: "pointer" }}
                                onClick={onClickHighlighter}
                            />
                        </span>

                        <span
                            className={`footer-size ${isPencilActive ? 'footer__tools-border' : ''}`}
                        >
                            <img

                                alt="Red Marker"
                                style={{ cursor: 'pointer' }}
                                src={RedMarker}
                                onClick={onClickPencil}
                            />
                        </span>


                        {isScreenMarked ?
                            <span className="footer-size" >
                                <img
                                    src={Eraser}
                                    alt="eraser"
                                    onClick={onClickEraser}
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                            :
                            <span className="footer-size">
                                <img
                                    src={Eraser}
                                    alt="eraser"
                                    style={{ opacity: 0.5 }}
                                />
                            </span>
                        }


                        <span
                            className={`footer-size ${showCalculator ? 'footer__tools-border' : ''}`}
                        >

                            {isCalculatorAllowed && isMath && (
                                <img
                                    className="calculator-icon"
                                    id='calculator'
                                    onClick={onClickCalculator}
                                    style={{ cursor: "pointer" }}
                                    src={Calculator}
                                    alt="Calculator"
                                />
                            )}
                        </span>

                    </div>

                    <div className="cmsFooter__buttons">
                        <div className="cmsFooter__buttons-wrapper">
                            <button disabled={isPausedByTeacher || !currentQuestion.updated} onClick={() => { clearPencil(); setShowClearModal(true) }} className="btn cancel-btn btn-medium">Clear</button>
                            <button onClick={() => { clearPencil(); setShowPauseExitModal(true) }} className="btn orange-btn light btn-medium">Pause/Exit</button>
                            <button disabled={isPausedByTeacher || !hasPreviousQuestion} onClick={() => { clearPencil(); previousQuestion() }} className="btn cancel-btn btn-medium">Back</button>
                            <button disabled={isPausedByTeacher || !hasNextQuestion} onClick={() => { clearPencil(); nextQuestion() }} className="btn cancel-btn btn-medium">Next</button>
                            <button disabled={isPausedByTeacher || hasNextQuestion} onClick={() => { clearPencil(); setShowFinishModal(true) }} className="btn success-btn btn-medium">Finish</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
