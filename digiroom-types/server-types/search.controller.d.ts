import { YoutubeService } from '@/services/youtube.service';
import { NextFunction, Request, Response } from 'express';
declare class YoutubeController {
    youtubeService: YoutubeService;
    searchPlaylists: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default YoutubeController;
