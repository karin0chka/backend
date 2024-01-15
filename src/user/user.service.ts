import { IUser } from '../../interfaces/entities.interface';
import Todo from '../.database/pg/.entities/todo.entity';
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
  export async function updateUserInfo(dto: Partial<IUser>, id: number) {
    return myDataSource.getRepository(User).update(id, dto);
  }
  export async function deleteUser(id: number) {
    return myDataSource.getRepository(User).softDelete(id);
  }
  export async function getUserTodos(userID: number) {
    //@ts-ignore
    return await myDataSource.getRepository(Todo).find({ where: { user: { id: userID } } })
  }
}

export default UserService;
//TODO implement update,delete and create functions
