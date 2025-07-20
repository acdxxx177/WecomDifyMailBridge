import { decrypt, getSignature, encrypt } from '@wecom/crypto'

export class WecomCrpyt {
  // 企业微信Token
  private static token: string = process.env.WECOM_CALLBACK_TOKEN!
  // 企业微信EncodingAESKey
  private static encodingAESKey: string = process.env.WECOM_CALLBACK_AESKEY!

  /**
   * 解密
   * @param {string} ciphered 密文
   * @return {string}
   */
  public static decrypt(ciphered: string) {
    try {
      const { id, message } = decrypt(this.encodingAESKey, ciphered)
      console.log(`id: ${id}`)
      console.log(`message: ${message}`)
      return message
    } catch (e) {
      console.log(e)
      return null
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
  public static verify(
    timestamp: number,
    nonce: string,
    echostr: string,
    msg_signature: string,
  ) {
    const signature = this.signature(timestamp, nonce, echostr)
    return signature === msg_signature
  }

  /**
   * 签名
   * @param timestamp 时间戳
   * @param nonce 随机数
   * @param echostr 随机字符串
   * @returns
   */
  public static signature(timestamp: number, nonce: string, echostr: string) {
    return getSignature(this.token, timestamp, nonce, echostr)
  }

  /**
   * 加密
   * @param message 消息
   * @param id id 企业微信的CorpID
   * @returns
   */
  public static encrypt(message: string, id: string) {
    return encrypt(this.encodingAESKey, message, id)
  }
}
