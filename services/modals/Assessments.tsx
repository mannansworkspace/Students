
export interface Assessment {
    id: number;
    name: string;
    type: string;
}


export default interface Assessments extends Array<Assessment> {}

export interface AssessmentsAPI {
    formatives: Assessments;
    summatives: Assessments
}