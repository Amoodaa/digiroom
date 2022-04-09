import { CreateRoomDto } from '@/dtos/room.dto';
import { Room } from '@/models/room.model';
import { RoomService } from '@/services/room.service';
import { NextFunction, Request, Response } from 'express';

class RoomController {
  public roomService = new RoomService();

  public getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneRoomData: Room = await this.roomService.foundRoomById(userId);

      res.status(200).json({ data: findOneRoomData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomData: CreateRoomDto = req.body;
      const createRoomData: Room = await this.roomService.createRoom(roomData);

      res.status(201).json({ data: createRoomData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const roomData: CreateRoomDto = req.body;
      const updateRoomData: Room = await this.roomService.updateRoom(userId, roomData);

      res.status(200).json({ data: updateRoomData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteRoomData: Room = await this.roomService.deleteRoom(userId);

      res.status(200).json({ data: deleteRoomData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default RoomController;
