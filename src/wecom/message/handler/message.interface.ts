import type { ReceiveMessage } from "../schemas/index.js";
export interface MessageHandler {
  handle(message: ReceiveMessage): string;
}