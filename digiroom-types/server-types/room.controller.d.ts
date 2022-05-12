import { RoomService } from '@/services/room.service';
import { NextFunction, Request, Response } from 'express';
declare class RoomController {
    roomService: RoomService;
    getRoomByName: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteRoom: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default RoomController;
