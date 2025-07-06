# WecomDifyMailBridge - 企业微信与Dify智能邮件处理桥接系统

## 项目概述
**核心功能**：搭建基于 Hono.js 的轻量级服务，接收企业微信邮件回调事件，通过 Dify AI 工作流处理邮件内容，并将结果推送至企业微信。

**技术特点**：
- 使用 Hono.js 框架构建高性能 HTTP 服务
- 企业微信回调验证与 XML 消息处理
- Dify API 集成实现 AI 邮件处理
- 完整 TypeScript 类型安全实现
- 异步处理避免阻塞回调响应

## 项目逻辑流程
```mermaid
sequenceDiagram
    participant 企业微信
    participant 本服务
    participant DifyAPI
    
    企业微信->>本服务: 邮件回调事件 (XML)
    本服务->>本服务: 验证签名 & 解密
    本服务->>本服务: 解析XML提取邮件内容
    本服务->>DifyAPI: 发送邮件内容 (JSON)
    DifyAPI->>本服务: 返回AI处理结果
    本服务->>企业微信: 推送通知消息 (JSON)