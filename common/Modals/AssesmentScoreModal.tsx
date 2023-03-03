import { Modal } from "react-bootstrap"
import { useDispatch } from "react-redux"
// import http from "services/core/HttpService"
import { logout } from "app/reducer/authSlice"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { QuestionnaireContext } from "components/Assessment/QuestionnaireContext"
import { isNumber } from "mathjs"

const AssesmentScoreModal = () => {

    const logoutStudent = () => {
        setAssessmentScore(null!)
        dispatch(logout())
        navigate('/')
    }

    const {
        assessmentScore,
        setAssessmentScore,
        questions
    } = useContext(QuestionnaireContext)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const answeredQuestions = (assessmentScore * questions.length)/100
    const totalQuestions = questions.length

    useEffect(() => {
        return () => {
            localStorage.removeItem('assesmentScore');
        }
    }, [])

    return <Modal centered show={isNumber(assessmentScore)} onHide={() => { }} onEscapeKeyDown={() => { }}>
        <div className="modal__header">
            <h6 className="modal__header-title">
                Assessment Score: {assessmentScore}%
            </h6>
        </div>
        <div className="modal__body">
            <p className="BodyParagraph">
                Your assessment has been submitted. You answered <strong>{answeredQuestions} out of {totalQuestions}</strong> questions correctly.
            </p>
        </div>
        <div className="modal__footer">
            <button
                className="btn cancel-btn mx-2 cursor-pointer"
                onClick={logoutStudent}
            >
                Log Out
            </button>
            <button
                className="btn success-btn cursor-pointer"
                onClick={() => {
                    setAssessmentScore(null!)
                    navigate('/select-assessment')
                }}
            >
                Select Another Assessment
            </button>
        </div>
    </Modal>
}
export default AssesmentScoreModal