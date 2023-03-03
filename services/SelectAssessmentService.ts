import apiConstants from "./Constant/ApiConstant";
import http from "./core/HttpService";
import ClassRooms from "./modals/ClassRooms";
import { AssessmentsAPI } from "./modals/Assessments";
import AppAPIResponse from './modals/AppAPIResponse'


export const getClassesService = async (): Promise<any> => {
    try {
        const response = await http.get<AppAPIResponse<ClassRooms>>(`${apiConstants.Student}/list-classrooms-tests`);

        return Promise.resolve(response.data);
    }
    catch (error) {
        return Promise.reject(error);
    }
} 

export const getAssessmentsService = async (classroomId: number): Promise<any> => {
    try {
        const result = await http.get<AppAPIResponse<AssessmentsAPI>>(`${apiConstants.Student}/list-students-tests?classroom_id=${classroomId}`);

        return Promise.resolve(result.data);
    }
    catch (error) {
        return Promise.reject(error);
    }
} 