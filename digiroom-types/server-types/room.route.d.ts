import RoomsController from '@controllers/room.controller';
import { Routes } from '@interfaces/routes.interface';
declare class RoomsRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    roomController: RoomsController;
    constructor();
    private initializeRoutes;
}
export default RoomsRoute;
