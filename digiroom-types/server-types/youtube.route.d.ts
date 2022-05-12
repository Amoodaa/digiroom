import { Routes } from '@interfaces/routes.interface';
import YoutubeController from '@/controllers/search.controller';
declare class YoutubeRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    youtubeController: YoutubeController;
    constructor();
    private initializeRoutes;
}
export default YoutubeRoute;
