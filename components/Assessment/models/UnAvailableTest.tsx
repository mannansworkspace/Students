import { FC, useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { QuestionnaireContext } from '../QuestionnaireContext';
import { logout } from "app/reducer/authSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "app/hooks";

const UnAvailableTestModal: FC<{}> = () => {

    const {
        showUnAvailableTestModal,
        setShowUnAvailableTestModal,
    } = useContext(QuestionnaireContext)

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePress = (event: any) => {
            if (event.keyCode === 27) {
                setShowUnAvailableTestModal(false);
            }
        }

        showUnAvailableTestModal && document.addEventListener('keydown', handlePress, false);

        return () => {
            document.removeEventListener('keydown', handlePress, false);
        }
    }, [showUnAvailableTestModal, setShowUnAvailableTestModal])

    const onLogout = () => {
        dispatch(logout()).then(() => navigate('/'));
    }
    const onSelectAssessment = () => {
        navigate('/select-assessment');
    }
    return (
        <div className = {`${showUnAvailableTestModal && 'mainContent-backDrop'}`}>
        <Modal
            centered
            show={showUnAvailableTestModal}
            size="lg"
            contentClassName="finish-modal"
        >
            <div>
                <div className="modal__header">
                    <h6 className="modal__header-title">
                        Assessment Unavailable
                    </h6>
                </div>
                <div className="modal__body">
                    <p>
                        This assessment is no longer available.
                    </p>
                </div>
                <div className="modal__footer">
                    <button
                        onClick={onLogout}
                        className="btn cancel-btn mx-3"
                    >
                        Log Out
                    </button>

                    <button
                        onClick={onSelectAssessment}
                        className="btn success-btn btn-lg"
                    >
                        Select Another Assessment
                    </button>
                </div>
            </div>
        </Modal>
        </div>
    );
};

export default UnAvailableTestModal;