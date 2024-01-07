import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import User from "./user.entity";

@Entity()
class Todo {
  @PrimaryGeneratedColumn()
  id: number;

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
