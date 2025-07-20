import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { backcallGetSchema, backcallPostSchema } from './schemas/index.js'
import { WecomCrpyt } from '../crpyt/index.js'
import { XMLParserWrapper } from '../../utils/xml-parser.js'
import { receive_message } from '../message-schemas/message.js'
import { MessageProcessing } from '../message/message-processing.js'

const app = new Hono()

// 企业微信回调get请求
app.get('/', zValidator('query', backcallGetSchema), (c) => {
  console.log('微信回调get请求')
  // 提取接收参数
  const { echostr, timestamp, nonce, msg_signature } = c.req.valid('query')
  // 验证是否为企业微信回调
  if (WecomCrpyt.verify(timestamp, nonce, echostr, msg_signature)) {
    // 解密
    const msg = WecomCrpyt.decrypt(echostr)
    // 返回解密后的数据
    return c.text(msg || '')
  } else {
    return c.text('error')
  }
})

app.post('/', zValidator('query', backcallPostSchema), async (c) => {
  console.log('微信回调post请求')
  // 提取接收参数
  const { timestamp, nonce, msg_signature } = c.req.valid('query')
  // 获取post数据
  const body = await c.req.text()
  const messageProcessing = new MessageProcessing(body)
  const result = messageProcessing.process({ timestamp, nonce, msg_signature })
  return c.text(result)
})

export default app
