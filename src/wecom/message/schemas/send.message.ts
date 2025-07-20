import { z } from 'zod'

// 消息结构体
const BaseMessage = z.object({
  // 企业微信CorpID
  ToUserName: z.string(),
  // 创建消息的成员UserID
  FromUserName: z.string(),
  // 消息创建时间（整型）
  CreateTime: z.coerce.number(),
})

// 文本消息结构体
export const text_send_message = BaseMessage.extend({
  MsgType: z.literal('text'),
  Content: z.string(),
})

// 接收消息联合体
export const send_message = z.discriminatedUnion('MsgType', [text_send_message])

// 接收消息包装
export const send_message_wrapper = z.object({
  xml: send_message,
})

export type SendMessage = z.infer<typeof send_message>
export type TextSendMessage = z.infer<typeof text_send_message>
