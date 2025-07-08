import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { backcallGetSchema, backcallPostSchema } from "./schemas/index.js";
import { WecomCrpyt } from "../crpyt/index.js";
import { XMLParserWrapper } from "../../utils/xml-parser.js";
import { receive_message } from "../message-schemas/message.js"
import { MessageProcessing } from "../message/message-processing.js";

const app = new Hono();

const wecomCrpyt = new WecomCrpyt(
  process.env.WECOM_CALLBACK_TOKEN,
  process.env.WECOM_CALLBACK_AESKEY
);

// 企业微信回调get请求
app.get("/", zValidator("query", backcallGetSchema), (c) => {
  console.log("微信回调get请求");
  const { echostr, timestamp, nonce, msg_signature } = c.req.valid("query");

  if (wecomCrpyt.verify(timestamp, nonce, echostr, msg_signature)) {
    const msg = wecomCrpyt.decrypt(echostr);
    console.log(msg);
    return c.text(msg || "");
  } else {
    return c.text("error");
  }
});

app.post("/", zValidator("query", backcallPostSchema), async (c) => {
  console.log("微信回调post请求");
  const { timestamp, nonce, msg_signature } = c.req.valid("query");
  const body = await c.req.text();
  const xmlParser = new XMLParserWrapper();
  console.log(body);
  if (xmlParser.validate(body)) {
    const xml = xmlParser.parse(body,receive_message).xml;
    console.log("xml：");
    console.log(xml);
    if (wecomCrpyt.verify(timestamp, nonce, xml.Encrypt, msg_signature)) {
      const msg = wecomCrpyt.decrypt(xml.Encrypt);
      console.log("msg");
      console.log(msg);
      if(msg){
        const messageProcessing = new MessageProcessing();
        messageProcessing.process(msg);
      }
      return c.text(msg || "");
    } else {
      console.log("验证失败");
      return c.text("error");
    }
  }
  return c.text("");
});

export default app;
