import { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  selectClassRooms,
  selectAssessments,
  getAssessmentsAction,
  setSelectedAssessment,
  getClassesAction,
} from "app/reducer/assessmentSlice";
import {
  logout
} from "app/reducer/authSlice";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { useNavigate } from "react-router-dom";
import TestIcon from "assets/img/review-test-btn.svg";
import RefreashIcon from "assets/img/refresh-icon.png";

import cookie from "js-cookie";

const AssessmentModal: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const classRooms = useAppSelector(selectClassRooms);
  const assessments = useAppSelector(selectAssessments);

  const [classId, setClassId] = useState<number>(-1);
  const [assessmentId, setAssessmentId] = useState<number>(-1);
  const [assessmentType, setAssessmentType] = useState("");
  const [assessmentName, setAssessmentName] = useState("");

  const onSubmit = () => {
    const selectedClass = classRooms.find((cls: any) => cls.id === classId)
    const isMath = selectedClass?.name.includes('Math') || false

    cookie.set('isMath', `${isMath}`)
    cookie.set('classroom_id', `${classId}`);
    if (selectedClass) {
      cookie.set('class_name', selectedClass.name);
      cookie.set('text_to_speech_enabled', `${selectedClass.text_to_speech_enabled}`);
      cookie.set('assessmentName', assessmentName);
    }
    dispatch(setSelectedAssessment(assessmentName))

    navigate(`/${assessmentType}/${assessmentId}`);
  };



  const onChangeClass = (classId: number) => {
    dispatch(getAssessmentsAction(classId));
    setClassId(classId);
    setAssessmentId(-1)
    setAssessmentName("")
    setAssessmentType("")
  };

  const onChaneAssessment = (event: any) => {
    const { value } = event.target;
    const assessmentType = event.target[event.target.selectedIndex].dataset.assessmenttype;
    setAssessmentId(value);
    setAssessmentType(assessmentType);

    const selectedAssessment = assessments.find((assessment: any) => assessment.id === parseInt(value) && assessment.type === assessmentType);
    selectedAssessment && setAssessmentName(selectedAssessment.name);
  };

  const onLogout = () => {
    dispatch(logout()).then(() => navigate('/'));
  }

  const refresh = () => {
    setClassId(-1)
    setAssessmentId(-1)
    setAssessmentName("")
    setAssessmentType("")
    dispatch(getClassesAction())
  }
  return (
    <Modal centered show={true}>
      <div>
        <div className="modal__header">
          <img src={TestIcon} alt="Test icon" className="modal__header-icon" />
          <h6 className="modal__header-title">Select Assessment</h6>
        </div>
        <div className="modal__body">
          <div className="modal__form">
            <div>
              <p>Select the assessment to edit below.</p>
            </div>
            <div className="modal__form-row">
              <label>Class</label>
              <select
                value={classId}
                onChange={(e) => onChangeClass(parseInt(e.target.value))}
                className="form-select cms-assessment-select"
                disabled={!classRooms.length}
              >
                <option value="-1" disabled>
                  Select Class
                </option>
                {classRooms.map((item: any) => (
                  <option
                    // disabled={!item.has_assessment}
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={`modal__form-row ${!assessments.length ? 'disabled' : ''}`}>
              <label>Assessment</label>
              <select
                disabled={!assessments.length}
                value={assessmentId}
                onChange={(e) => onChaneAssessment(e)}
                className="form-select cms-assessment-select"
              >
                <option value="-1" disabled>
                  Select Assessment
                </option>
                {assessments.map((item) => (
                  <option
                    className="mt-5"
                    key={item.id}
                    data-assessmenttype={item.type}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <div className="cms-assessment-footer">
            <div>
                <div
                  onClick={refresh}
                  className="refreash-btn mx-2"
                >
                  <img src={RefreashIcon} alt="Test icon"  />
                </div>
            </div>
            <div>
              <button
                onClick={onLogout}
                className="btn cancel-btn mx-3"
              >
                Log Out
              </button>

              <button
                disabled={assessmentId === -1}
                onClick={onSubmit}
                className={`btn success-btn ${assessmentId === -1 ? "disabled" : ""
                  }`}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssessmentModal;
