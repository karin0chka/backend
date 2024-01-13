import { IUser } from '../../interfaces/entities.interface';
import User from '../.database/pg/.entities/user.entity';
import { myDataSource } from '../.database/pg/db';
import { FindOneOptions } from 'typeorm';

namespace UserService {
  export function findOne(criteria: FindOneOptions<IUser>) {
    return myDataSource.getRepository(User).findOne(criteria);
  }
  export function findOneOrFail(criteria: FindOneOptions<IUser>) {
    return myDataSource.getRepository(User).findOneOrFail(criteria);
  }
}

export default UserService;
//TODO implement update,delete and create functions
