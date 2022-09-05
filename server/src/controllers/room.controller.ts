import { CreateRoomDto } from '@/dtos/room.dto';
import { Room } from '@/models/room.model';
import { roomService } from '@/services/room.service';
import { userService } from '@/services/user.service';
import { NextFunction, Request, Response } from 'express';

class RoomController {
  public getRoomByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomName } = req.params;
      const findOneRoomData: Room = await roomService.findRoomByName(roomName);

      res.status(200).json({ data: findOneRoomData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomData: CreateRoomDto = req.body;
      const createRoomData: Room = await roomService.createRoom(roomData);

      res.status(201).json({ data: createRoomData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const roomData: CreateRoomDto = req.body;
      const updateRoomData: Room = await roomService.updateRoom(roomId, roomData);

      res.status(200).json({ data: updateRoomData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const deleteRoomData: Room = await roomService.deleteRoom(roomId);

      res.status(200).json({ data: deleteRoomData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomName } = req.params;
      console.log(roomName);
      const chat = await roomService.getChatForRoom(roomName);

      res.status(200).json({ data: chat, message: 'getChat' });
    } catch (error) {
      next(error);
    }
  };

  public addUserToRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomName } = req.params;
      const { username } = req.body;

      if (!username) throw new Error('Username is required');

      const room = await userService.addUserToRoom(roomName, username);

      res.status(200).json({ data: room, message: 'addUserToRoom' });
    } catch (error) {
      next(error);
    }
  };
}

export default RoomController;
