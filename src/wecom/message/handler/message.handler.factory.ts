import type {MessageHandler } from './message.interface.js';
import { TextMessageHandler } from './imp/text-message.handler.js';
import { ImgMessageHandler } from './imp/img-message.handler.js';

/**
 * 消息处理工厂类
 */
export class MessageHandlerFactory {
  static getHandler(msgType: string): MessageHandler | null {
    switch (msgType) {
      case 'text':
        return new TextMessageHandler();
      case 'image':
        return new ImgMessageHandler();
      default:
        return null;
    }
  }
}