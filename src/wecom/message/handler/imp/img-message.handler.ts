import type { MessageHandler } from '../message.interface.js'
import type { ImgReceiveMessage } from '../../schemas/receive.message.js'
import type { SendMessage } from '../../schemas/send.message.js'
import { TimeUtils } from '../../../../utils/time.js'

/**
 * 图片消息处理
 */
export class ImgMessageHandler implements MessageHandler {
  handle(message: ImgReceiveMessage): SendMessage {
    const { ToUserName, FromUserName, PicUrl } = message
    console.log('处理图片消息:', PicUrl)
    return {
      ToUserName,
      FromUserName,
      CreateTime: TimeUtils.getCurrentTimeInMillis(),
      MsgType: 'text',
      Content: '图片消息已接收',
    }
  }
}
