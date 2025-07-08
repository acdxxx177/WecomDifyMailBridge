import type { MessageHandler } from '../message.interface.js';
import type { TextReceiveMessage } from '../../schemas/index.js';

/**
 * 文本消息处理
 */
export class TextMessageHandler implements MessageHandler {
  handle(message: TextReceiveMessage) {
    console.log('处理文本消息:', message.Content);
    return ""
  }
}