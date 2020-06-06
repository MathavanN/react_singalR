export interface IActivity {
    id: string;
    appUserId: string;
    name: string;
    status: string;
    result: string
}

export interface ICreateActivity {
    name: string
}

export interface IUpdateActivityStatus {
    id: string;
    percentage: number
}