import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Todo from "./todo.entity";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

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
