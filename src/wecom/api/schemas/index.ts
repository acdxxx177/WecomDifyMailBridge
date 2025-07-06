import { z } from "zod";

// 微信get请求回调参数
export const backcallSchema = z.object({
  msg_signature: z.string(),
  timestamp: z.coerce.number(),
  nonce: z.string(),
  echostr: z.string(),
});
