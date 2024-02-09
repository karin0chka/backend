import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import Default from "./default.entity"
import User from "./user.entity"
import { INotification, IUser } from "../../../../interfaces/entities.interface"

@Entity()
class Notification extends Default implements INotification {
  @Column()
  title: string

  @Column()
  message: string

  @Column({ default: false })
  is_read: boolean

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn()
  user: IUser
}

export default Notification
