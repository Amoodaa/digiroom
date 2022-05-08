import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@/exceptions/HttpError';
declare const errorMiddleware: (error: HttpError, req: Request, res: Response, next: NextFunction) => void;
export default errorMiddleware;
