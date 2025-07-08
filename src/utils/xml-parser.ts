import { z } from "zod"
import { XMLParser } from "fast-xml-parser";

export class XMLParserWrapper {
    private parser: XMLParser;

    constructor() {
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            parseTagValue: false,
            parseAttributeValue: false,
            trimValues: false,
        })
    }

    validate(xml: string): boolean {
        try {
            this.parser.parse(xml);
            return true;
        } catch (e) {
            return false;
        }
    }

    parse<T>(xml: string,schema: z.ZodType<T>): T {
        try {
            const json = this.parser.parse(xml);
            return schema.parse(json);
        } catch (e) {
            console.error(e);
            throw new Error("xml parse error");
        }
    }
}