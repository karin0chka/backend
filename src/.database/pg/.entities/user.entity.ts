import { Column, Entity, Index, OneToMany } from "typeorm"
import Default from "./default.entity"
import Todo from "./todo.entity"
import { IUser } from "../../../../interfaces/entities.interface"
import { UserType } from "../../../../interfaces/enums"
import { Exclude } from "class-transformer"

@Entity()
class User extends Default implements IUser {
  @Column()
  first_name: string

  @Column()
  last_name: string

  @Index()
  @Column()
  email: string

  @Exclude()
  @Column()
  password: string

  @Exclude()
  @Column({ nullable: true })
  refresh_token: string

  @Column({ type: "enum", enum: UserType, default: UserType.CLIENT })
  user_type: UserType

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[]
}

export default User
