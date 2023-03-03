import apiConstants from "./Constant/ApiConstant";
import http from "./core/HttpService";

export const getQuestions = async (assessmentType: string, assessmentId: number, classroomId: number): Promise<any> => {
    try {
        const { data } = await http.get(`${apiConstants.Student}/${assessmentType}/${assessmentId}/${classroomId}`)
        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

export const updateQuestions = async (updatedQuestions: any, assessmentType: string): Promise<any> => {

}

export const submitAnswer = async (assessmentType: string, assessment_id: number, question_number: number, response: number, classroomId: number, time_in_minutes: number) => {
    try {
        const { data } = await http.put(`${apiConstants.Student}/${assessmentType}/${assessment_id}/${question_number}/${response}/${classroomId}?time_in_minutes=${time_in_minutes}`)

        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

export const submitAssessment = async (assessmentType: string, assessment_id: number, classroom_id: number) => {
    try {
        const { data } = await http.post(`${apiConstants.Student}/${assessmentType}/${assessment_id}/${classroom_id}/submit`);

        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

export const putTestTimeService = async (test_id: number, is_formative: boolean, classroom_id: any) => {
    try {
        const { data } = await http.put(`${apiConstants.TestTime}/${test_id}/${classroom_id}/${is_formative}?time_in_seconds=60`)
        console.log({ data })
    } catch (error) {
        console.log(error)
    }
}
