export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: any;
}
