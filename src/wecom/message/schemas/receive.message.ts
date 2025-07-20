import { z } from 'zod'

// 消息结构体
const BaseMessage = z.object({
  // 企业微信CorpID
  ToUserName: z.string(),
  // 创建消息的成员UserID
  FromUserName: z.string(),
  // 消息创建时间（整型）
  CreateTime: z.coerce.number(),
  // 消息类型，此时固定为：text
  MsgId: z.coerce.number(),
  // 企业应用的id，整型。可在应用的设置页面查看
  AgentID: z.coerce.number(),
})

// 文本消息结构体
export const text_receive_message = BaseMessage.extend({
  // 消息类型，此时固定为：text
  MsgType: z.literal('text'),
  // 文本消息内容
  Content: z.string(),
})

// 图片消息结构体
export const img_receive_message = BaseMessage.extend({
  // 消息类型，此时固定为：image
  MsgType: z.literal('image'),
  // 图片消息媒体id，可以调用获取媒体文件接口拉取数据。
  PicUrl: z.string(),
  // 图片消息媒体id，可以调用获取媒体文件接口拉取数据。
  MediaId: z.string(),
})

// 接收消息联合体
export const receive_message = z.discriminatedUnion('MsgType', [
  text_receive_message,
  img_receive_message,
])

// 接收消息包装
export const receive_message_wrapper = z.object({
  xml: receive_message,
})

export type ReceiveMessage = z.infer<typeof receive_message>
export type TextReceiveMessage = z.infer<typeof text_receive_message>
export type ImgReceiveMessage = z.infer<typeof img_receive_message>
