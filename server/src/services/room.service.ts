import { CreateRoomDto } from '@dtos/room.dto';
import { HttpError } from '@/exceptions/HttpError';
import { isEmpty } from '@utils/util';
import { RoomModel, Room } from '@/models/room.model';
import { youtubeClient } from '@/utils/youtube';
import { ChatModel, Chat, Message } from '@/models/chat.model';

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
      newRoom.currentPlaylistItems = await youtubeClient.playlists.items(playlistId, {
        maxResults: '50',
      });
    }

    if (videoId) {
      newRoom.currentVideoId = videoId;

      if (newRoom.currentPlaylistItems) {
        const foundVideoId = newRoom.currentPlaylistItems.items.find(
          item => item.contentDetails.videoId === videoId,
        ).contentDetails.videoId;
        newRoom.currentVideoId = foundVideoId;
      }
    } else {
      if (newRoom.currentPlaylistItems) {
        newRoom.currentVideoId =
          newRoom.currentPlaylistItems.items[0].snippet.resourceId.videoId;
      } else {
        throw new HttpError(400, 'No video or playlist id??');
      }
    }

    newRoom.currentVideo = await youtubeClient.videos.get(newRoom.currentVideoId);

    const createRoomData = await RoomModel.create(newRoom);

    return createRoomData;
  }

  // TODO:
  // public async addUserToRoom(roomId: string, userId: string): Promise<Room> {
  //   const foundRoom = await RoomModel.findByIdAndUpdate(roomId);

  //   if (!foundRoom) throw new HttpError(404, "You're not room");

  //   return foundRoom;
  // }

  public async changeCurrentVideo(roomName: string, videoId: string): Promise<Room> {
    const foundRoom = await RoomModel.findOne({ name: roomName });

    if (!foundRoom) throw new HttpError(404, "You're not room");

    foundRoom.currentVideoId = videoId;
    foundRoom.currentVideo = await youtubeClient.videos.get(foundRoom.currentVideoId);

    await foundRoom.save();

    return foundRoom;
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

  public async getChatForRoom(roomName: string): Promise<Chat> {
    const foundRoom = await RoomModel.findOne({ name: roomName });

    if (!foundRoom) throw new HttpError(404, "You're not room");

    const foundMessages = await ChatModel.findOne({ room: foundRoom._id }).lean();

    return foundMessages;
  }

  public async sendMessageToRoom(roomName: string, message: Message): Promise<void> {
    if (isEmpty(roomName)) throw new HttpError(400, 'No roomid provided');
    if (isEmpty(message)) throw new HttpError(400, 'No message provided');

    const room = await RoomModel.findOne({ name: roomName }).select('_id');

    if (!room) throw new HttpError(404, 'Room not found');

    await ChatModel.updateOne(
      { room: room._id },
      {
        $push: { messages: message },
      },
      { upsert: true },
    );
  }
}
