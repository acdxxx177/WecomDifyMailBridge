import type { MessageHandler } from '../message.interface.js'
import type { TextReceiveMessage } from '../../schemas/receive.message.js'
import type { SendMessage } from '../../schemas/send.message.js'
import { TimeUtils } from '../../../../utils/time.js'

/**
 * 文本消息处理
 */
export class TextMessageHandler implements MessageHandler {
  handle(message: TextReceiveMessage): SendMessage {
    const { ToUserName, FromUserName, Content } = message
    console.log('处理文本消息:', Content)
    return {
      ToUserName,
      FromUserName,
      CreateTime: TimeUtils.getCurrentTimeInMillis(),
      MsgType: 'text',
      Content: '文本消息已接收',
    }
  }
}
