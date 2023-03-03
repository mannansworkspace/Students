import { ReactChild, createContext, FC, useEffect, useState, useRef } from 'react'
import { getQuestions, updateQuestions, submitAnswer, submitAssessment } from 'services/AssessmentService';
import {
    selectAssessments,
    setSelectedAssessment,
    putTestTimeAction
} from "app/reducer/assessmentSlice";
import { useAppDispatch } from "app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import socketKeys from './socket-keys';
import { io } from 'socket.io-client';
import { eraseDrawing, getMarkings } from 'util/RaphaelInit';
import { ApiFailure } from "index";
import { isMultipleLoginErrorSelector, setMultipleLoginError } from 'app/reducer/errorSlice';
import { isNumber } from 'mathjs';

interface question {
    id: number;
    passage_directions: string;
    passage_1: string;
    passage_2: string;
    direction: string;
    question: string;
    choice_1: string;
    choice_2: string;
    choice_3: string;
    choice_4: string;
    answer: number;
    bookMarked: boolean;

    updated: boolean,
    questionNo: number;
    shares_text_with: number;
    penMarkings: any,
    isScreenMarked: boolean
}

interface QuestionnaireContextModal {
    setIsSpeechIconClicked: (a: boolean) => void;
    isSpeechIconClicked: boolean;
    isHighlighterActive: boolean;
    setIsHighlighterActive: (isHighlighterActive: boolean) => void;
    setShowCalculator: (show: boolean) => void;
    showCalculator: boolean;
    hasPassage: boolean;
    showTabs: boolean;
    questionIdx: number;
    setQuestionIdx: (idx: number) => void;
    questions: question[];
    currentQuestion: question;
    nextQuestion: () => void;
    previousQuestion: () => void;
    hasNextQuestion: boolean;
    hasPreviousQuestion: boolean;
    isTestUpdated: boolean;
    onRevert: () => void;
    onSave: () => void;
    onClear: () => void;
    onExit: () => void;
    onChange: (key: string, value: any) => void;
    show: boolean;
    setShow: (value: boolean) => void;
    tabIndex: number,
    setTabIndex: (tabIndex: number) => void;
    showSaveModal: boolean;
    setShowSaveModal: (showModal: boolean) => void;
    showClearModal: boolean;
    setShowPauseExitModal: (showModal: boolean) => void;
    setShowClearModal: (showModal: boolean) => void;
    showPauseExitModal: boolean;
    showFinishModal: boolean;
    setShowFinishModal: (show: boolean) => void;
    keyToSpeak: string;
    setKeyToSpeak: (key: string) => void;
    keys: string[];
    onSpeak: (key: string) => void;
    isPencilActive: boolean;
    setIsPencilActive: (pecnilActive: boolean) => void;
    setIsPaused: (pause: boolean) => void;
    isPaused: boolean;
    onSubmitAssessment: () => void;
    setIsScreenMarked: (a: boolean) => void;
    onAnswerChange: (choice: number) => void;
    isPausedByTeacher: boolean;
    setIsPausedByTeacher: (a: boolean) => void;
    onChangeQuestionFromTopBar: (questionNumber: number) => void;
    showUnAvailableTestModal: boolean;
    setShowUnAvailableTestModal: (show: boolean) => void;
    assessmentScore: number,
    setAssessmentScore: (score: number) => void,
    saveExpressionAndMarkings: () => void,
    containerRef: any

}

const questionKeys = ['passage_directions', 'direction', 'question', 'choice_1', 'choice_2', 'choice_3', 'choice_4']

export const QuestionnaireContext = createContext({} as QuestionnaireContextModal)

interface Props {
    children: ReactChild | ReactChild[];
}

const QuestionnaireContextProvider: FC<Props> = (props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { assessmentType, id } = useParams();

    const assessments = useSelector(selectAssessments);

    const classroom_id = Cookies.get('classroom_id');
    const student_id = parseInt(Cookies.get('student_id') || '');

    const [questions, setQuestions] = useState<question[]>([])
    const [questionIdx, setQuestionIdx] = useState<number>(0)
    const [show, setShow] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [showClearModal, setShowClearModal] = useState(false)
    const [showPauseExitModal, setShowPauseExitModal] = useState(false)
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [isHighlighterActive, setIsHighlighterActive] = useState(false);
    const [isSpeechIconClicked, setIsSpeechIconClicked] = useState(false);
    const [keyToSpeak, setKeyToSpeak] = useState<string>(null!);
    const [isPencilActive, setIsPencilActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [initUpdatePostion, setInitUpdatePostion] = useState(false);
    const [isPausedByTeacher, setIsPausedByTeacher] = useState(false);
    const [socketInit, setSocketInit] = useState(false)
    const [showUnAvailableTestModal, setShowUnAvailableTestModal] = useState(false);
    const [assessmentScore, setAssessmentScore] = useState<number>(null!)
    const [keys, setKeys] = useState<string[]>([...questionKeys])
    const currentQuestion: any = questions[questionIdx] || {}
    const [isSocketEnable, setisSocketEnable] = useState<boolean>(false)
    const socketRef = useRef<any>();
    const isMultipleLoginError = useSelector(isMultipleLoginErrorSelector)
    const containerRef = useRef<HTMLDivElement>(null)

    const {
        SOCKET_STUDENT_UPDATE_ANSWER,
        SOCKET_STUDENT_SUBMIT,
        SOCKET_STUDENT_JOIN_ROOM,
        SOCKET_STUDENT_UPDATE_POSITION_QUESTION,
        SOCKET_TEACHER_PAUSE_RESUME,
        SOCKET_TEACHER_FORCE_SUBMIT,
        SOCKET_TEACHER_KICK_STUDENT,
        SOCKET_TEACHER_CLEAR_ANSWER,
        SOCKET_CLASS_BY_ID_CHANNEL,
        SOCKET_STUDENT_TEST_TIME,
        SOCKET_DISCONNECT_EVENT,
        SOCKET_STUDENT_LOG_OUT
    } = socketKeys;


    const ayncFetchQuestions = async (assessmentType: string, assessmentId: string, classroomId: string) => {
        console.log("ayncFetchQuestions")
        const data = await getQuestions(assessmentType, parseInt(assessmentId), parseInt(classroomId));
        Cookies.set('allow_calculator', `${data.allow_calculator}`);
        if (data) {
            setIsPausedByTeacher(data.is_paused);
            setisSocketEnable(data.allowed_monitoring)
        }

        setQuestions(
            data.questions.map((q: any, index: number) => {
                const answer = parseInt(q.student_answer);
                const currentQuestion = {
                    ...q,
                    questionNo: index + 1,
                    answer: isNaN(answer) ? null : answer,
                    bookMarked: false,
                    penMarkings: [],
                    isScreenMarked: false
                }

                if (currentQuestion.shares_passage_with) {

                    const sharedQuestion = data.questions.find((qes: any) => qes.id === currentQuestion.shares_passage_with)

                    if (sharedQuestion) {
                        currentQuestion['passage_directions'] = sharedQuestion.passage_directions
                        currentQuestion['passage_1'] = sharedQuestion.passage_1
                        currentQuestion['passage_2'] = sharedQuestion.passage_2
                    }
                }

                return currentQuestion
            })
        )
    }

    useEffect(() => {

        return () => {
            eraseDrawing()
        }
    }, [])


    useEffect(() => {
        let element: HTMLElement | null = null;
        if (keyToSpeak && ['passage_1', 'passage_2'].some((passage) => keyToSpeak.includes(passage))) {
            element = document.getElementById(keyToSpeak)
            if (element) {
                element.classList.add('playtts')
            }
        }
        return () => {
            if (element) {
                element.classList.remove('playtts')
            }
        }

    }, [keyToSpeak])

    useEffect(() => {
        const token = Cookies.get('token');

        if (!isSocketEnable || !token)
            return

        socketRef.current = io(process.env.REACT_APP_API_URL as string, {
            transports: ["websocket"],
            auth: { token },
            query: {},
        });

        socketRef.current.io.engine.opts.query.reconnecting = true;

        window.addEventListener('beforeunload', (event: any) => {
            event.preventDefault();
            socketRef.current?.close()
        })
        window.addEventListener('unload', (event: any) => {
            event.preventDefault();
            socketRef.current?.close()
        })

        socketRef.current?.on('connect_error', function (error: any) {
            ApiFailure.setApiError(true, null!);
        })

        socketRef.current?.on('connect', () => {
            socketRef.current?.on(SOCKET_STUDENT_LOG_OUT, async (data: any) => {
                console.log('********************************');
                console.log('********************************');
                console.log('*****Stundent Multiple login event*****');
                console.log('********************************');
                console.log('********************************');
                console.log('event: SOCKET_STUDENT_LOG_OUT', JSON.stringify(data));

                dispatch(setMultipleLoginError(true))
            })

            socketRef.current?.on(SOCKET_CLASS_BY_ID_CHANNEL, async (data: any) => {
                console.log('********************************');
                console.log('********************************');
                console.log('*****Teacher Event Received*****');
                console.log('********************************');
                console.log('********************************');
                console.log('event: socket-class-by-id-channel', JSON.stringify(data));

                ApiFailure.setApiError(false, null!);
            })

            socketRef.current?.emit(SOCKET_STUDENT_JOIN_ROOM, {
                classroom_id,
                student_id,
                is_formative: assessmentType === 'formatives',
                test_id: id
            });

            // socketRef.current.onerror = (e: any) => {
            //     console.log("WEB SOCKET ERROR POPPED UP : ", e)
            // }
        })
        return () => {
            socketRef.current?.close()
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [isSocketEnable])

    useEffect(() => {
        let interval: any = null
        if (!isPaused && !isPausedByTeacher && !isMultipleLoginError) {
            interval = setInterval(() => {
                const is_formative = assessmentType === 'formatives'
                id && dispatch(putTestTimeAction(parseInt(id), is_formative, classroom_id))

                socketRef.current?.emit(SOCKET_STUDENT_TEST_TIME, {
                    classroom_id,
                    student_id,
                    is_formative: assessmentType === 'formatives',
                    test_id: id
                });

            }, 1000 * 60)
        }

        return () => {
            interval && clearInterval(interval)
        }
    }, [isPaused, isPausedByTeacher, isMultipleLoginError])


    useEffect(() => {
        socketRef.current?.on(SOCKET_CLASS_BY_ID_CHANNEL, async (data: any) => {
            console.log('********************************');
            console.log('********************************');
            console.log('*****Student Event Received*****');
            console.log('********************************');
            console.log('********************************');
            console.log('event: socket-class-by-id-channel', data);

            const { type, classroom_id: classroomId, test_id } = data.resource
            if (type === SOCKET_STUDENT_JOIN_ROOM) {
                setSocketInit(true)
            }
            else if (type === SOCKET_TEACHER_PAUSE_RESUME) {
                if (classroomId === classroom_id && test_id === id) {

                    setIsPausedByTeacher(prevState => !prevState);
                }
            }
            else if (type === SOCKET_TEACHER_FORCE_SUBMIT) {
                if (
                    data.resource.student_id === null || data.resource.student_id === undefined ||
                    data.resource.student_id === student_id
                ) {
                    onSubmitAssessment();
                    // navigation added here because of additional modal on submit for score 
                    navigate('/select-assessment');
                }

            } else if (type === SOCKET_TEACHER_KICK_STUDENT) {
                if (!isNumber(data.resource.student_id) || data.resource.student_id === student_id)
                    setShowUnAvailableTestModal(true)

            } else if (type === SOCKET_TEACHER_CLEAR_ANSWER) {

                if (data.resource.student_id === null || data.resource.student_id === undefined) {
                    onClearAnswers()
                } else if (data.resource.student_id === student_id) {
                    onClearAnswers()
                }
            }
        });

        return () => {
            socketRef.current?.off(SOCKET_CLASS_BY_ID_CHANNEL)
        }
    }, [questions])

    useEffect(() => {

        if (assessmentType && id && classroom_id) {
            ayncFetchQuestions(assessmentType, id, classroom_id);
        }
        else
            navigate('/cms/select-assessment');
    }, [assessmentType, id, navigate])


    useEffect(() => {
        if (assessments.length > 0 && id && assessmentType) {
            const selectedAssessment = assessments.find((assessment: any) => assessment.id === parseInt(id) && assessment.type === assessmentType)
            if (selectedAssessment) {
                dispatch(setSelectedAssessment(selectedAssessment.name));
            }
        }
    }, [dispatch, assessments, id, assessmentType])

    useEffect(() => {
        const passageId = `passage_${tabIndex + 1}`

        const passageNodes = document.getElementById(passageId)?.querySelectorAll("p, li, span");

        const passageKeys: string[] = []
        passageNodes?.forEach((node: any, idx) => {
            if (node?.innerText?.trim().length) {
                const passageKey = `${passageId}_${idx + 1}`
                node.id = passageKey
                currentQuestion[passageKey] = node.innerText
                passageKeys.push(passageKey)
                node.onclick = () => isSpeechIconClicked && setKeyToSpeak(passageKey)

                node?.classList?.add('my-4')
            }
            else {
                // There is one scenario where the html tag has only one tag and that is <img> tag.
                // in that case, the innerText in above IF condition would evaluate to FALSE 
                // but we don't want to delete this NODE because the text in this NODE is empty 
                // but it still has <img> tag.
                if(!node?.innerHTML?.trim().includes("img")) node?.parentNode?.removeChild(node);
            }
        })

        const newKeys = [...questionKeys]

        newKeys.splice(1, 0, ...passageKeys);

        setKeys(newKeys)

        return () => {
            const passageNodes = document.getElementById(passageId)?.querySelectorAll("p");

            passageNodes?.forEach((node: any) => {
                node.onclick = () => false
            })
            setKeys([...questionKeys])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion.id, tabIndex])

    const getDomValues = () => {
        const domValues: any = {}

        keys.forEach(k => {
            const container = document.getElementById(k)
            if (container?.innerHTML) {
                domValues[k] = container?.innerHTML
            }
        })

        return domValues
    }


    const onSubmitAssessment = async () => {
        if (assessmentType && id && classroom_id) {
            const resp = await submitAssessment(assessmentType, parseInt(id), parseInt(classroom_id));
            if (resp?.submitted) {
                socketRef.current?.emit(SOCKET_STUDENT_SUBMIT, {
                    classroom_id: classroom_id,
                    is_formative: assessmentType === 'formatives',
                    test_id: id,
                    student_id
                });
            }

            setAssessmentScore(resp.score_percentage)
        }
        setShowFinishModal(false);
        socketRef.current?.close()
    }

    const onClearAnswers = () => {
        const updatedQuestions: question[] = questions.map(question => ({ ...question, answer: null! }))

        setQuestions(updatedQuestions)
    }

    const onSpeak = (key: any) => {
        isSpeechIconClicked && setKeyToSpeak(key);
    }

    const saveExpressionAndMarkings = () => {
        const penMarkings = getMarkings();
        const domValues = getDomValues()
        questions[questionIdx] = {
            ...questions[questionIdx],
            penMarkings: penMarkings,
            ...domValues
        }
        setQuestions(questions)
        setShowCalculator(false)

    }

    const nextQuestion = () => {
        saveExpressionAndMarkings()
        if (questionIdx < questions.length) {
            setQuestionIdx(questionIdx + 1)
        }
    }

    const previousQuestion = () => {
        saveExpressionAndMarkings()
        if (questionIdx > 0) {
            setQuestionIdx(questionIdx - 1)
        }
    }

    const onChangeQuestionFromTopBar = (questionIndex: number) => {
        saveExpressionAndMarkings()
        setQuestionIdx(questionIndex)
    }

    const onRevert = async () => {
        if (assessmentType && id && classroom_id) {
            ayncFetchQuestions(assessmentType, id, classroom_id)
        }
    }

    const onSave = async () => {
        const updatedQuestions = questions.filter(question => question.updated);

        if (assessmentType && updatedQuestions.length) {
            await updateQuestions(updatedQuestions, assessmentType);
            setQuestions(questions.map(q => ({ ...q, updated: false })))
        }
    }

    const onClear = async () => {

        questions[questionIdx] = {
            ...questions[questionIdx],
            updated: false,
            answer: null!
        }

        setQuestions([...questions])
        socketRef.current?.emit(SOCKET_STUDENT_UPDATE_ANSWER, {
            classroom_id,
            is_formative: assessmentType === 'formatives',
            answer: null,
            test_id: id,
            question_id: currentQuestion.id,
            student_id,
        })
    }

    const onExit = async () => {
        socketRef.current?.emit(SOCKET_DISCONNECT_EVENT, {
            student_id: student_id
        });
    }

    const onAnswerChange = async (choice: number) => {
        onChange('answer', choice)
        socketRef.current?.emit(SOCKET_STUDENT_UPDATE_ANSWER, {
            classroom_id,
            is_formative: assessmentType === 'formatives',
            answer: choice,
            test_id: id,
            question_id: currentQuestion.id,
            student_id,
        })

        if (assessmentType && id && classroom_id) {
            await submitAnswer(assessmentType, parseInt(id), currentQuestion.id, choice, parseInt(classroom_id), 5);
        }
    }

    const onChange = (key: string, value: any) => {
        questions[questionIdx] = {
            ...questions[questionIdx],
            [key]: value,
            updated: true,
        }

        setQuestions([...questions])
    }

    const setIsScreenMarked = (value: boolean) => {
        if (value && questions[questionIdx].isScreenMarked)
            return

        questions[questionIdx] = {
            ...questions[questionIdx],
            isScreenMarked: value,
        }

        setQuestions([...questions])
    }

    const hasNextQuestion = questionIdx < questions.length - 1
    const hasPreviousQuestion = questionIdx > 0

    //calles when questions changes
    useEffect(() => {
        setTabIndex(0)
        currentQuestion && socketInit && socketRef.current?.emit(SOCKET_STUDENT_UPDATE_POSITION_QUESTION, {
            classroom_id,
            is_formative: assessmentType === 'formatives',
            test_id: id,
            question_id: currentQuestion.id,
            student_id,
        });
    }, [questionIdx])

    useEffect(() => {
        currentQuestion?.id && socketInit && !initUpdatePostion && socketRef?.current.emit(SOCKET_STUDENT_UPDATE_POSITION_QUESTION, {
            classroom_id,
            is_formative: assessmentType === 'formatives',
            test_id: id,
            question_id: currentQuestion.id,
            student_id,
        });

        currentQuestion.id && socketInit && setInitUpdatePostion(true)
    }, [questions, socketInit])

    const isTestUpdated = questions.some(q => q.updated);

    const hasPassage = currentQuestion.passage_1 !== null
    const showTabs = currentQuestion.passage_2 !== null

    console.log({ questions })
    return (
        <QuestionnaireContext.Provider
            value={{
                isPausedByTeacher,
                setIsPausedByTeacher,
                setIsScreenMarked,
                onSubmitAssessment,
                setIsPaused,
                isPaused,
                setIsPencilActive,
                isPencilActive,
                onSpeak,
                keyToSpeak,
                setKeyToSpeak,
                keys,
                isSpeechIconClicked,
                setIsSpeechIconClicked,
                setIsHighlighterActive,
                isHighlighterActive,
                setShowCalculator,
                showCalculator,
                showFinishModal,
                setShowFinishModal,
                hasPassage,
                showTabs,
                show,
                setShow,
                questionIdx,
                setQuestionIdx,
                currentQuestion,
                questions,
                nextQuestion,
                previousQuestion,
                hasNextQuestion,
                hasPreviousQuestion,
                isTestUpdated,
                onRevert,
                onSave,
                onChange,
                tabIndex,
                setTabIndex,
                showSaveModal,
                setShowSaveModal,
                onAnswerChange,
                onClear,
                onExit,
                showClearModal,
                setShowClearModal,
                showPauseExitModal,
                setShowPauseExitModal,
                onChangeQuestionFromTopBar,
                showUnAvailableTestModal,
                setShowUnAvailableTestModal,
                setAssessmentScore,
                assessmentScore,
                saveExpressionAndMarkings,
                containerRef

            }}
        >
            {props.children}
        </QuestionnaireContext.Provider>
    )
}

export default QuestionnaireContextProvider;
