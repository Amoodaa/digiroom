import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import YoutubeController from '@/controllers/search.controller';

class YoutubeRoute implements Routes {
  public path = '/youtube';
  public router = Router({ mergeParams: true });
  public youtubeController = new YoutubeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/search`, this.youtubeController.searchPlaylists); // TODO: cache
  }
}

export default YoutubeRoute;
