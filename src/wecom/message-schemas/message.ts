import {z} from 'zod';
// 回调post接收消息
export const receive_message = z.object({
  xml: z.object({
    // 企业微信的CorpID，当为第三方应用回调事件时，CorpID的内容为suiteid
    ToUserName: z.string(),
    // 消息结构体加密后的字符串
    Encrypt: z.string(),
    // 接收的应用id，可在应用的设置页面获取。仅应用相关的回调会带该字段。
    AgentID: z.string(),
  }),
});