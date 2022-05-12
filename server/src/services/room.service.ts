import { CreateRoomDto } from '@dtos/room.dto';
import { HttpError } from '@/exceptions/HttpError';
import { isEmpty } from '@utils/util';
import { RoomModel, Room } from '@/models/room.model';
import { youtubeClient } from '@/utils/youtube';

export class RoomService {
  public async findRoomById(roomId: string): Promise<Room> {
    if (isEmpty(roomId)) throw new HttpError(400, "You're not roomId");

    const foundRoom = await RoomModel.findById(roomId).lean();
    if (!foundRoom) throw new HttpError(404, "You're not room");

    return foundRoom;
  }

  public async findRoomByName(roomName: string): Promise<Room> {
    if (isEmpty(roomName)) throw new HttpError(400, "You're not roomName");

    const foundRoom = await RoomModel.findOne({ name: roomName }).lean();
    if (!foundRoom) throw new HttpError(404, `Room with name ${roomName} not found`);

    return foundRoom;
  }

  public async createRoom(roomData: CreateRoomDto): Promise<Room> {
    if (isEmpty(roomData)) throw new HttpError(400, "You're not roomData");

    const { name, playlistId, videoId } = roomData;

    const foundRoom = await RoomModel.findOne({ name });

    if (foundRoom) throw new HttpError(409, `Room with ${name} already exists`);

    const newRoom: Room = {
      name,
      currentPlaylistItems: undefined,
      currentPlaylistInfo: undefined,
      currentVideoId: videoId,
      currentVideo: undefined,
    };

    if (playlistId) {
      newRoom.currentPlaylistInfo = await youtubeClient.playlists.get(playlistId);
      newRoom.currentPlaylistItems = await youtubeClient.playlists.items(playlistId, { maxResults: '50' });
    }

    if (videoId) {
      newRoom.currentVideoId = videoId;

      if (newRoom.currentPlaylistItems) {
        const foundVideoId = newRoom.currentPlaylistItems.items.find(item => item.contentDetails.videoId === videoId).contentDetails.videoId;
        newRoom.currentVideoId = foundVideoId;
      }
    } else {
      if (newRoom.currentPlaylistItems) {
        newRoom.currentVideoId = newRoom.currentPlaylistItems.items[0].snippet.resourceId.videoId;
      } else {
        throw new HttpError(400, 'No video or playlist id??');
      }
    }

    newRoom.currentVideo = await youtubeClient.videos.get(newRoom.currentVideoId);

    const createRoomData = await RoomModel.create(newRoom);

    return createRoomData;
  }

  public async updateRoom(roomId: string, roomData: CreateRoomDto): Promise<Room> {
    if (isEmpty(roomData)) throw new HttpError(400, "You're not roomData");

    const updateRoomById = await RoomModel.findByIdAndUpdate(roomId, { roomData });
    if (!updateRoomById) throw new HttpError(409, 'No room found by this id');

    return updateRoomById;
  }

  public async deleteRoom(roomId: string): Promise<Room> {
    const deleteRoomById = await RoomModel.findByIdAndDelete(roomId);
    if (!deleteRoomById) throw new HttpError(409, "You're not room");

    return deleteRoomById;
  }
}
