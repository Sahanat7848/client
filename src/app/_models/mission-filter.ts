export interface MissionFilter {
    name?: string;
    status?: MissionStatus;
}

export type MissionStatus = 'open' | 'InProgress' | 'Completed' | 'Failed';
