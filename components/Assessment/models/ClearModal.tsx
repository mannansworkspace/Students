import { FC, useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { QuestionnaireContext } from '../QuestionnaireContext'

const ClearModal: FC<{}> = () => {
    const {
        onClear,
        showClearModal,
        setShowClearModal,
    } = useContext(QuestionnaireContext)

    const onClearAndClose = () => {
        onClear();
        setShowClearModal(false);
    }
   

    useEffect(() => {
        const handlePress = (event :any) => {
            if(event.keyCode === 27){
                setShowClearModal(false);
            }
        }

        showClearModal && document.addEventListener('keydown', handlePress, false);

        return () => {
            document.removeEventListener('keydown', handlePress, false);
        }
    },[showClearModal, setShowClearModal])

    return (
        <Modal 
            centered
            show={showClearModal}
            size="lg"
        >
            <div>
                <div className="modal__header">
                    <h6 className="modal__header-title">Clear the current question? </h6>
                </div>
                <div className="modal__body">
                    <p>
                        You will lose all your current work for this question.
                    </p>
                </div>
                <div className="modal__footer mx-4">
                    <button
                        onClick={() => setShowClearModal(false)}
                        className="btn cancel-btn mx-3"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onClearAndClose}
                        className="btn success-btn btn-lg"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ClearModal;