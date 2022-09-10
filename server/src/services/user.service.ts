import { HttpError } from '@/exceptions/HttpError';
import { Room, RoomModel, User } from '@/models/room.model';

export class UserService {
  public async addUserToRoom(roomName: string, username: string): Promise<Room> {
    const foundRoom = await RoomModel.findOne({ name: roomName });

    if (!foundRoom) throw new HttpError(404, "You're not room");

    const userExists = foundRoom.users.find(user => user.name === username);

    if (userExists) throw new HttpError(409, `User with ${username} already exists`);

    foundRoom.users.push({ name: username, role: 'guest', state: 'offline' });

    await foundRoom.save();

    return foundRoom;
  }

  // this only called from socket events
  public async joinRoom(
    roomName: string,
    username: string,
    socketId: string,
  ): Promise<User> {
    const foundRoom = await RoomModel.findOne({ name: roomName });

    if (!foundRoom) throw new HttpError(404, "You're not room");

    const userExists = foundRoom.users.find(user => user.name === username);

    if (!userExists) throw new HttpError(404, `User with ${username} doesn't exist`);

    userExists.state = 'online';
    userExists.socketId = socketId;

    await foundRoom.save();

    return userExists;
  }

  // this only called from socket events
  public async leaveRoom(roomName: string, socketId: string): Promise<User> {
    const foundRoom = await RoomModel.findOne({ name: roomName });

    if (!foundRoom) throw new HttpError(404, "You're not room");

    const userLeft = foundRoom.users.find(user => user.socketId === socketId);

    if (!userLeft) throw new HttpError(404, `User with ${socketId} doesn't exist`);

    userLeft.state = 'offline';
    userLeft.socketId = null;

    await foundRoom.save();

    return userLeft;
  }
}

export const userService = new UserService();
