import { Router } from 'express';
import RoomsController from '@controllers/room.controller';
import { CreateRoomDto } from '@dtos/room.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class RoomsRoute implements Routes {
  public path = '/room';
  public router = Router({ mergeParams: true });
  public usersController = new RoomsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // /room
    this.router.post(``, validationMiddleware(CreateRoomDto, 'body'), this.usersController.createRoom);
    this.router.get(`/:id`, this.usersController.getRoomById);
    this.router.put(`/:id`, validationMiddleware(CreateRoomDto, 'body', true), this.usersController.updateRoom);
    this.router.delete(`/:id`, this.usersController.deleteRoom);
  }
}

export default RoomsRoute;
