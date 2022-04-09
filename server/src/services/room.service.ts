import { CreateRoomDto } from '@dtos/room.dto';
import { HttpError } from '@/exceptions/HttpError';
import { isEmpty } from '@utils/util';
import { RoomModel, Room } from '@/models/room.model';

export class RoomService {
  public async foundRoomById(roomId: string): Promise<Room> {
    if (isEmpty(roomId)) throw new HttpError(400, "You're not roomId");

    const foundRoom = await RoomModel.findById(roomId).lean();
    if (!foundRoom) throw new HttpError(409, "You're not room");

    return foundRoom;
  }

  public async createRoom(roomData: CreateRoomDto): Promise<Room> {
    if (isEmpty(roomData)) throw new HttpError(400, "You're not roomData");

    const { name } = roomData;
    const foundRoom = await RoomModel.findOne({ name });

    if (foundRoom) throw new HttpError(409, `Room with ${name} already exists`);

    const createRoomData = await RoomModel.create({ ...roomData, name });

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
