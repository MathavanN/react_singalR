export interface IUser {
    id: string;
    userName: string;
    displayName: string;
    token: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}