import { NextFunction, Request, Response } from 'express';
declare class RoomController {
    getRoomByName: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getChat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default RoomController;
