import { Router } from 'express';
import RoomsController from '@controllers/room.controller';
import { CreateRoomDto } from '@dtos/room.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class RoomsRoute implements Routes {
  public path = '/room';
  public router = Router({ mergeParams: true });
  public roomController = new RoomsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // /room
    this.router.post(
      ``,
      validationMiddleware(CreateRoomDto, 'body'),
      this.roomController.createRoom,
    );
    this.router.get(`/:roomName`, this.roomController.getRoomByName);
    this.router.put(
      `/:roomId`,
      validationMiddleware(CreateRoomDto, 'body', true),
      this.roomController.updateRoom,
    );
    this.router.delete(`/:roomId`, this.roomController.deleteRoom);

    // /room/:roomName/chat
    this.router.get(`/:roomName/chat`, this.roomController.getChat);

    // /room/:roomName/user
    this.router.post(`/:roomName/user`, this.roomController.addUserToRoom);
  }
}

export default RoomsRoute;
