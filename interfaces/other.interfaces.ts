import { Request } from 'express';
import { IUser } from './entities.interface';

export interface RequestWithUser extends Request {
  user: IUser;
}
