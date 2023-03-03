import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "app/store";
import {
  getAssessmentsService,
  getClassesService,
} from "services/SelectAssessmentService";
import ClassRooms from "services/modals/ClassRooms";
import Assessments from "services/modals/Assessments";
import { putTestTimeService } from "services/AssessmentService";

interface AssessmentState {
  assessments: Assessments;
  classRooms: ClassRooms;
  assessmentName: string;
}

const initialState: AssessmentState = {
  assessments: [],
  classRooms: [],
  assessmentName: null!,
};

export const studentSlice = createSlice({
  name: "assessmentReducer",
  initialState,
  reducers: {
    setAssessments: (state, action: PayloadAction<Assessments>) => {
      state.assessments = action.payload;
    },
    setClassRooms: (state, action: PayloadAction<ClassRooms>) => {
      state.classRooms = action.payload;
    },
    setSelectedAssessment: (state, action: PayloadAction<string>) => {
      state.assessmentName = action.payload;
    },
  },
});

export default studentSlice.reducer;

export const { setAssessments, setClassRooms, setSelectedAssessment } =
  studentSlice.actions;

export const selectAssessments = (state: AppState) =>
  state.assessmentReducer.assessments;

export const selectClassRooms = (state: AppState) =>
  state.assessmentReducer.classRooms;
export const selectAssessmentName = (state: AppState) =>
  state.assessmentReducer.assessmentName;

export const getAssessmentsAction =
  (classroomId: number) => async (dispatch: AppDispatch) => {
    const { summatives, formatives } = await getAssessmentsService(classroomId);

    const assessments = [];

    assessments.push(
      ...summatives.map((summative: any) => {
        return {
          ...summative,
          type: "summatives",
        };
      })
    );

    assessments.push(
      ...formatives.map((formative: any) => {
        return {
          ...formative,
          type: "formatives",
        };
      })
    );

    dispatch(setAssessments(assessments));
  };

export const getClassesAction = () => async (dispatch: AppDispatch) => {
  const { classrooms } = await getClassesService();

  dispatch(setClassRooms(classrooms));
  dispatch(setAssessments([]));
};

export const putTestTimeAction =
  (test_id: number, is_formative: boolean, classroom_id: any) =>
  async (dispatch: AppDispatch) => {
    putTestTimeService(test_id, is_formative, classroom_id);
  };
