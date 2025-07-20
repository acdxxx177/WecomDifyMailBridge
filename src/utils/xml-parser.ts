import { z } from 'zod'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

/**
 * CDATA 包裹结构
 */
export interface CDataString {
  CDATA_: string
}

export class XMLParserWrapper {
  private parser: XMLParser
  private builder: XMLBuilder

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseTagValue: false,
      parseAttributeValue: false,
      trimValues: false,
    })
    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      cdataPropName: 'CDATA_',
    })
  }

  validate(xml: string): boolean {
    try {
      this.parser.parse(xml)
      return true
    } catch (e) {
      return false
    }
  }

  parse<T>(xml: string, schema: z.ZodType<T>): T {
    try {
      const json = this.parser.parse(xml)
      return schema.parse(json)
    } catch (e) {
      console.error(e)
      throw new Error('xml parse error')
    }
  }

  parseToXml<T>(data: T, converCdata: boolean = true): string {
    try {
      const _data = converCdata ? this.wrapCData(data) : data
      return this.builder.build(_data)
    } catch (e) {
      console.error(e)
      throw new Error('xml build error')
    }
  }

  /**
   * 将对象中 string 字段包裹为 CDATA
   * @param input 输入对象
   */
  private wrapCData<T>(input: T): T {
    // 处理数组类型
    if (Array.isArray(input)) {
      return input.map((item) => this.wrapCData(item)) as unknown as T
    }

    // 处理对象类型
    if (input !== null && typeof input === 'object') {
      const result: Record<string, unknown> = {}
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          result[key] = this.wrapCData((input as Record<string, unknown>)[key])
        }
      }
      return result as T
    }

    // 基础类型处理，只包裹 string 类型
    if (typeof input === 'string') {
      return { CDATA_: input } as T & CDataString
    }

    // 其他类型直接返回
    return input
  }
}
