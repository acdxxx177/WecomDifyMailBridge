import { receive_message_wrapper } from "./schemas/index.js";
import { XMLParserWrapper } from "../../utils/xml-parser.js";
import { MessageHandlerFactory } from "./handler/message.handler.factory.js";

/**
 * 消息处理类
 */
export class MessageProcessing {
    process(message:string) {
        const xmlParser = new XMLParserWrapper();
        if (xmlParser.validate(message)) {
            const parsedMessage = xmlParser.parse(message,receive_message_wrapper);
            const handler = MessageHandlerFactory.getHandler(parsedMessage.xml.MsgType);
            if (handler) {
                handler.handle(parsedMessage.xml);
            } else {
                console.warn('未知的消息类型');
            }
        }else{
            throw new Error("不是xml格式的消息");
        }
    }
}
