import React, { useContext, useEffect, useState } from 'react';
import { ReactComponent as ShowIcon } from "assets/img/hide-icon-1.svg";
import { ReactComponent as HideIcon } from "assets/img/hide-icon-2.svg";

import { QuestionnaireContext } from "./QuestionnaireContext";
import HtmlParser from './HtmlParser';

interface IChoice {
    choiceText: string,
    choice: string,
    option: number
}

const Choice: React.FC<IChoice> = ({ choice, choiceText, option }: IChoice) => {

    const {
        isSpeechIconClicked,
        currentQuestion,
        onAnswerChange,
        onSpeak,
        keyToSpeak
    } = useContext(QuestionnaireContext);

    const [hide, setHide] = useState(false);

    const {
        answer
    } = currentQuestion;

    useEffect(() => {
        setHide(false)
    }, [currentQuestion])

    return (
        <>
            <div className="questions__question-icons">
                <button className="questions__question-icon">
                    {
                        hide ?
                            <ShowIcon
                                onClick={() => setHide(prevState => !prevState)}
                            />
                            :
                            <HideIcon
                                onClick={() => setHide(prevState => !prevState)}
                            />
                    }

                </button>
                <span
                    className={` questions__question-suggest 
                        ${answer === option ? "fill" : ""}
                        `}
                    onClick={() => onAnswerChange(option)}
                >
                    {choice}
                </span>
            </div>
            {!hide && (
                <p
                    onClick={() => onSpeak(`choice_${option + 1}`)}
                    className={`${isSpeechIconClicked && 'ondemandtts'} questions__question-choice ${keyToSpeak === `choice_${option+1}` && 'playtts' }`}
                >
                    <HtmlParser html={choiceText} id={`choice_${option + 1}`} />

                </p>
            )}
        </>
    );
}

export default Choice;