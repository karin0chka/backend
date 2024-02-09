import { EventEmitter } from "events"

export const notificationEvent = new EventEmitter()

export function sendNotificationMessage(userID: number, message: string) {
  notificationEvent.emit(`notification-user-${userID}`, message)
}
