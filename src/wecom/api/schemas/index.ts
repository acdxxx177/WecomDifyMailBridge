import { z } from "zod";

// 微信post请求回调参数
export const backcallPostSchema = z.object({
  msg_signature: z.string(),
  timestamp: z.coerce.number(),
  nonce: z.string(),
});

// 微信get请求回调参数
export const backcallGetSchema = backcallPostSchema.extend({
  echostr: z.string(),
});

