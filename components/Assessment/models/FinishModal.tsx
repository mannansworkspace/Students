import { FC, useContext, useEffect } from "react";
import { setAssessments } from "app/reducer/assessmentSlice";
import { Modal } from "react-bootstrap";
import { QuestionnaireContext } from '../QuestionnaireContext';
import { useDispatch } from "react-redux";

const FinishModal: FC<{}> = () => {

    const {
        showFinishModal,
        setShowFinishModal,
        questions,
        onSubmitAssessment,
        setQuestionIdx,
        saveExpressionAndMarkings
    } = useContext(QuestionnaireContext)

    const questionCompleted = questions.reduce((a, b) => b.answer !== undefined && b.answer !== null ? a + 1 : a, 0)
    const dispatch = useDispatch()


    useEffect(() => {
        const handlePress = (event: any) => {
            if (event.keyCode === 27) {
                setShowFinishModal(false);
            }
        }

        showFinishModal && document.addEventListener('keydown', handlePress, false);

        return () => {
            document.removeEventListener('keydown', handlePress, false);
        }
    }, [showFinishModal, setShowFinishModal])

    const isCompleted = questionCompleted > 0;

    const onReturnToTestClick = () => {
        const unAnswered = questions.findIndex(question => question.answer === undefined || question.answer === null)
        console.log({ unAnswered })
        setShowFinishModal(false)
        if (unAnswered >= 0) {
            saveExpressionAndMarkings()
            setQuestionIdx(unAnswered)
        }
    }

    const onFinishAssessment = () => {
        onSubmitAssessment()
        dispatch(setAssessments([]))

    }
    return (
        <Modal
            centered
            show={showFinishModal}
            size="lg"
            contentClassName="finish-modal"
        >
            <div>
                <div className="modal__header">
                    <h6 className="modal__header-title">
                        {`You have completed: ${questionCompleted} out of ${questions.length} question(s).`}
                    </h6>
                </div>
                <div className="modal__body">
                    <p>
                        Select "Return to Test" to review or "Finish" to submit test.
                    </p>
                </div>
                <div className="modal__footer">
                    <button
                        onClick={onReturnToTestClick}
                        className="btn cancel-btn mx-3"
                    >
                        Return To Test
                    </button>

                    <button
                        onClick={onFinishAssessment}
                        className="btn success-btn btn-lg"
                        disabled={!isCompleted}
                    >
                        Finish
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FinishModal;