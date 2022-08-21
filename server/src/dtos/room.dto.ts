import { Room } from '@/models/room.model';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDto implements Pick<Room, 'name'> {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public playlistId?: string;

  @IsString()
  @IsOptional()
  public videoId?: string;

  @IsString()
  public username: string;
}
