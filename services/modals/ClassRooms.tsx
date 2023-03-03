export interface ClassRoom {
    id: number;
    name: string;
    has_assessment: boolean;
    text_to_speech_enabled: boolean;
    allow_calculator: boolean;
}

export default interface ClassRooms extends Array<ClassRoom> {}