import { isApiErrorSelector, isAccessErrorSelector, isMultipleLoginErrorSelector, setApiConfig, setApiError, setMultipleLoginError, setAccessError } from "app/reducer/errorSlice"
import { Modal } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "app/reducer/authSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

const ApiResponseModal = () => {

    const isApiError = useSelector(isApiErrorSelector)
    const isAccessError = useSelector(isAccessErrorSelector)
    const isMultipleLoginError = useSelector(isMultipleLoginErrorSelector)
    const isError = isApiError || isAccessError || isMultipleLoginError
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const logoutStudent = () => {
        dispatch(logout())
        removeErrors()
        navigate('/')
    }

    const removeErrors = () => {
        dispatch(setApiConfig(null))
        dispatch(setApiError(false))
        dispatch(setAccessError(false))
        dispatch(setMultipleLoginError(false))
    }

    // this need to be added on login screen! Revision required
    useEffect(() => {
        console.log("LOCATION : ", location.pathname)
        if (location.pathname === '/') {
            removeErrors()
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    })


    return <div className={`${isError && 'mainContent-backDrop'}`}> <Modal centered show={isError} onHide={() => { }} onEscapeKeyDown={() => { }}>
        <div className="modal__header">
            <span className="rounded"></span>
            <h6 className="modal__header-title">
                {
                    isMultipleLoginError ? 'Multiple Logins'
                        : isAccessError ? 'Access Denied' :
                            'Connection Error'
                }
            </h6>
        </div>
        <div className="modal__body">
            {
                isMultipleLoginError ?
                    <p className="BodyParagraph">
                        This student account is logged into the Student Portal in another browser. You will now be logged out.
                    </p>
                    :
                    isAccessError ?
                        <p className="BodyParagraph">
                            Something went wrong. Please try again later.
                        </p>
                        :
                        <p className="BodyParagraph">
                            Your connection to the Alpha Plus servers is having trouble. this message will automatically close when the connection is restored.
                        </p>

            }

        </div>
        <div className="modal__footer">
            <button
                className="btn modal-logout-button cursor-pointer"
                onClick={logoutStudent}
            >
                Log Out
            </button>
        </div>
    </Modal>
    </div>
}
export default ApiResponseModal