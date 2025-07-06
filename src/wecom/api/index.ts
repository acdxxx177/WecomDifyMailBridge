import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { backcallSchema } from "./schemas/index.js";
import { WecomCrpyt } from "../crpyt/index.js";

const app = new Hono();

const wecomCrpyt = new WecomCrpyt(
  process.env.WECOM_CALLBACK_TOKEN,
  process.env.WECOM_CALLBACK_AESKEY
);

// 企业微信回调get请求
app.get("/", zValidator("query", backcallSchema), (c) => {
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

app.post("/", async (c) => {
  console.log("微信回调post请求");
  const body = await c.req.text();
  console.log(body);
  return c.text("");
});

export default app;
