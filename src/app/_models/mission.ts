import { MissionStatus } from "./mission-filter";

export interface Mission {
    id: number;
    name: string;
    description?: string;
    status: MissionStatus;
    chief_id: number;
    crew_count: number;
    created_at: Date;
    updated_at: Date;
}
