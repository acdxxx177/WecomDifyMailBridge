import { receive_message_wrapper } from './schemas/receive.message.js'
import { XMLParserWrapper } from '../../utils/xml-parser.js'
import { MessageHandlerFactory } from './handler/message.handler.factory.js'
import { receive_message } from '../message-schemas/message.js'
import { WecomCrpyt } from '../crpyt/index.js'
import { TimeUtils } from '../../utils/time.js'

/**
 * 消息处理类
 */
export class MessageProcessing {
  private xmlParser = new XMLParserWrapper()
  private toUserName: string
  private toAgentID: string
  private msg_encrypt: string

  constructor(body: string) {
    // 验证xml,并解密第一层密文
    if (this.xmlParser.validate(body)) {
      // 解析xml
      const message = this.xmlParser.parse(body, receive_message).xml
      this.toUserName = message.ToUserName
      this.toAgentID = message.AgentID
      this.msg_encrypt = message.Encrypt
    } else {
      throw new Error('Invalid XML')
    }
  }
  process({
    timestamp,
    nonce,
    msg_signature,
  }: {
    timestamp: number
    nonce: string
    msg_signature: string
  }): string {
    // 消息体签名校验
    if (WecomCrpyt.verify(timestamp, nonce, this.msg_encrypt, msg_signature)) {
      // 解密消息体
      const msg = WecomCrpyt.decrypt(this.msg_encrypt)
      // 是否验证成功
      if (msg && this.xmlParser.validate(msg)) {
        // 消息体转换成对象
        const parsedMessage = this.xmlParser.parse(msg, receive_message_wrapper)
        // 获取消息处理对象
        const handler = MessageHandlerFactory.getHandler(
          parsedMessage.xml.MsgType,
        )
        // 处理消息
        if (handler) {
          // 处理消息，返回结果
          const retuls = handler.handle(parsedMessage.xml)
          console.log(retuls)
          // 结果转换成xml
          const xmlstr = this.xmlParser.parseToXml({ xml: retuls })
          console.log(xmlstr)
          const ecn = WecomCrpyt.encrypt(xmlstr, this.toUserName)
          const s_timestamp = TimeUtils.getCurrentTimeInMillis()
          const sig = WecomCrpyt.signature(s_timestamp, nonce, ecn)
          return this.xmlParser.parseToXml({
            xml: {
              Encrypt: ecn,
              MsgSignature: sig,
              TimeStamp: s_timestamp,
              Nonce: nonce,
            },
          })
        } else {
          console.warn('未知的消息类型')
          return this.xmlParser.parseToXml({ xml: {} })
        }
      } else {
        throw new Error('获得的消息有误')
      }
    } else {
      throw new Error('企业微信加密校验失败')
    }
  }
}
