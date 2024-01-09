import { IUser } from "interfaces/entities.interface";
import User from "src/.database/pg/.entities/user.entity";
import { myDataSource } from "src/.database/pg/db";
import { FindOneOptions } from "typeorm";


export namespace UserService{
    export function findOne(criteria:FindOneOptions<IUser>){
        return myDataSource.getRepository(User).findOne(criteria)
    }

}
//TODO implement update,delete and create functions