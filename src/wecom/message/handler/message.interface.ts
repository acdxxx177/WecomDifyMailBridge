import type { ReceiveMessage } from '../schemas/receive.message.js'
import type { SendMessage } from '../schemas/send.message.js'
export interface MessageHandler {
  handle(message: ReceiveMessage): SendMessage
}
