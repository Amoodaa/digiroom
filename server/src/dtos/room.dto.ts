import { Room } from '@/models/room.model';
import { IsString } from 'class-validator';

export class CreateRoomDto implements Pick<Room, 'name'> {
  @IsString()
  public name: string;
}
