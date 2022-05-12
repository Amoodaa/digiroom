import { CreateRoomDto } from '@/dtos/room.dto';
import { Room } from '@/models/room.model';
import { RoomService } from '@/services/room.service';
import { NextFunction, Request, Response } from 'express';

class RoomController {
  public roomService = new RoomService();

  public getRoomByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomName } = req.params;
      const findOneRoomData: Room = await this.roomService.findRoomByName(roomName);

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
      const { roomId } = req.params;
      const roomData: CreateRoomDto = req.body;
      const updateRoomData: Room = await this.roomService.updateRoom(roomId, roomData);

      res.status(200).json({ data: updateRoomData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const deleteRoomData: Room = await this.roomService.deleteRoom(roomId);

      res.status(200).json({ data: deleteRoomData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default RoomController;
