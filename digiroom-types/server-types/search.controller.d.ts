import { NextFunction, Request, Response } from 'express';
declare class YoutubeController {
    searchPlaylists: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default YoutubeController;
