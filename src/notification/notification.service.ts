import { INotification, IUser } from "../../interfaces/entities.interface"
import Notification from "../.database/pg/.entities/notification.entity"
import { myDataSource } from "../.database/pg/db"

class NotificationService {
  notificationRepository = myDataSource.getRepository(Notification)

  async create(notificationDto: Partial<INotification>, user: IUser) {
    return await this.notificationRepository.save(
      this.notificationRepository.create({
        title: notificationDto.title,
        message: notificationDto.message,
        user: user,
        is_read: false,
      })
    )
  }

  async update(notificationDto: Pick<INotification, "title" | "message" | "is_read">, id: number) {
    return await this.notificationRepository.update(id, {
      title: notificationDto.title,
      message: notificationDto.message,
      is_read: notificationDto.is_read,
    })
  }

  async softDelete(id: number) {
    return await this.notificationRepository.softDelete(id)
  }
}

export default new NotificationService()
