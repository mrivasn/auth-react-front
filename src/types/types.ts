export interface AuthResponse {
    body: {
        user: UserActivation;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthResponseError {
    body:{
        error: string;
    };
}

export interface User {
    _id: string;
    name: string;
    username: string;
}