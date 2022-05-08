export declare class HttpError extends Error {
    status: number;
    message: string;
    isHttpError: boolean;
    constructor(status: number, message: string);
}
