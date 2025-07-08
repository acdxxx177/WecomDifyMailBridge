import type { MessageHandler } from '../message.interface.js';
import type { ImgReceiveMessage } from '../../schemas/index.js';

/**
 * 图片消息处理
 */
export class ImgMessageHandler implements MessageHandler {
  handle(message: ImgReceiveMessage) {
    console.log('处理图片消息:', message.PicUrl);
    return "";
  }
}