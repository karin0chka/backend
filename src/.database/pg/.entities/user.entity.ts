import { Column, Entity, OneToMany } from "typeorm";
import Default from "./default.entity";
import Todo from "./todo.entity";
import { IUser } from "../../../../interfaces/entities.interface";

@Entity()
class User extends Default implements IUser{

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email:string;

  @Column()
  password:string;

  @OneToMany(()=>Todo,(todo)=>todo.user)
  todos:Todo[]
}

export default User;
