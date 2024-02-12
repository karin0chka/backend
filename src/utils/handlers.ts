import { EventEmitter } from "events"
import { INotification } from "../../interfaces/entities.interface"

export const notificationEvent = new EventEmitter()

export function sendNotificationMessage(userID: number, message: INotification) {
  notificationEvent.emit(`notification-user-${userID}`, message)
}
