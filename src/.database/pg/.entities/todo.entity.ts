import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Default from "./default.entity";
import User from "./user.entity";

//TODO implement interfaces for entities and create base entity wich will propagate other entities
@Entity()
class Todo extends Default {

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  is_done: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: User;
}

export default Todo;
