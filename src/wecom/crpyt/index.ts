import { decrypt, getSignature } from "@wecom/crypto";

export class WecomCrpyt {
  // 企业微信Token
  private token: string;
  // 企业微信EncodingAESKey
  private encodingAESKey: string;

  /**
   * @param {string} token 企业微信Token
   * @param {string} encodingAESKey 企业微信EncodingAESKey
   */
  constructor(token: string, encodingAESKey: string) {
    this.token = token;
    this.encodingAESKey = encodingAESKey;
  }

  /**
   * 解密
   * @param {string} ciphered 密文
   * @return {string}
   */
  decrypt(ciphered: string) {
    try {
      const { id, message } = decrypt(this.encodingAESKey, ciphered);
      console.log(`id: ${id}`);
      console.log(`message: ${message}`);
      return message;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * 验证
   * @param {number} timestamp 时间戳
   * @param {string} nonce 随机数
   * @param {string} echostr 随机字符串
   * @param {string} msg_signature 消息签名
   * @return {boolean}
   */
  verify(
    timestamp: number,
    nonce: string,
    echostr: string,
    msg_signature: string
  ) {
    const signature = getSignature(this.token, timestamp, nonce, echostr);
    return signature === msg_signature;
  }
}
