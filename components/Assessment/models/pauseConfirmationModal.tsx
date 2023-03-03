/* eslint-disable react-hooks/exhaustive-deps */
import { FC} from "react";
import { Modal } from "react-bootstrap";


interface Props{
    show : boolean
    onClose :  () =>  void
}
const PauseConfirmationModal: FC<Props> = (props) => {

    const { onClose , show } = props


    return (
        <>
            <Modal
                centered
                show={show}
                size="xl"
            >
                <div>
                    <div className="modal__header">
                        <h6 className="modal__header-title">Your Test Session is <b>Paused.</b> </h6>
                    </div>
                    <div className="modal__body">
                        <h3>
                        To resume testing, please click the Resume button.
                        </h3>
                    </div>
                    <div className="modal__footer justify-content-center">
                        <button
                            onClick={onClose}
                            className="btn success-btn btn-lg"
                        >
                            Resume
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PauseConfirmationModal;