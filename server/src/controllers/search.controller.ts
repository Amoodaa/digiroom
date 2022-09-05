import { youtubeService } from '@/services/youtube.service';
import { NextFunction, Request, Response } from 'express';

class YoutubeController {
  public searchPlaylists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchTerm, type } = req.query as { searchTerm: string; type: string };
      const youtubeSearch = await youtubeService.searchYoutube(searchTerm, { type });

      res.status(200).json({ data: youtubeSearch, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default YoutubeController;
