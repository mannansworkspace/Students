/* eslint-disable react-hooks/exhaustive-deps */
import { setAssessments } from "app/reducer/assessmentSlice";
import { FC, useContext, useEffect , useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QuestionnaireContext } from '../QuestionnaireContext'
import PauseConfirmationModal from "./pauseConfirmationModal";

const PauseExitModal: FC<{}> = () => {
    const {
        setIsPaused,
        onClear,
        showPauseExitModal,
        setShowPauseExitModal,
        isPaused,
        onExit
    } = useContext(QuestionnaireContext)

    const [showConfirmation , setShowConfirmation] = useState<boolean>(false)

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const onExiting = () => {
        onClear();
        onExit();
        navigate('/select-assessment')
        setShowPauseExitModal(false);
        dispatch(setAssessments([]))
    }

    const handlePress = (event: any) => {
        if (event.keyCode === 27) {
            setShowPauseExitModal(false);
        }
    }

    const onPauseTest = () =>{
        setIsPaused(true)
        setShowPauseExitModal(false)
        setShowConfirmation(true)
    }

    const onResumeTest = () =>{
        setIsPaused(false)
        setShowConfirmation(false)
    }

    useEffect(() => {
        showPauseExitModal && document.addEventListener('keydown', handlePress, false);

        return () => {
            document.removeEventListener('keydown', handlePress, false);
        }
    }, [showPauseExitModal])

    return (
        <>
            {isPaused && <div className="mainContent-backDrop"></div>}
            <Modal
                centered
                show={showPauseExitModal}
                size="lg"
            >
                <div>
                    <div className="modal__header">
                        <h6 className="modal__header-title">Do you want to pause your test or exit your test? </h6>
                    </div>
                    <div className="modal__body">
                        <p>
                            Pause the test to temporarily logout. Exit the test to logout and close the testing application.
                        </p>
                    </div>
                    <div className="modal__footer justify-content-center">
                        <button
                            onClick={() => setShowPauseExitModal(false)}
                            className="btn cancel-btn"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onPauseTest}
                            className="btn success-btn btn-lg mx-3"
                        >
                            Pause
                        </button>
                        <button
                            onClick={onExiting}
                            className="btn success-btn btn-lg"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </Modal>
            <PauseConfirmationModal
                show={showConfirmation}
                onClose={onResumeTest}
            />
        </>
    );
};

export default PauseExitModal;
