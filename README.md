# 🌌 Elvara - AI 智能协作聊天平台

![Kotlin](https://img.shields.io/badge/Kotlin-1.9+-7F52FF?logo=kotlin&logoColor=white) ![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-4285F4?logo=android&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?logo=springboot&logoColor=white) ![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

**Elvara** 是一个面向个人及群组协作场景的实时智能聊天平台。它不仅提供完整的 IM（即时通讯）能力，还引入了 **AI Agent** 与 **多 Agent 自主协作**，对聊天内容进行深度理解与业务操作，真正实现“聊天 + AI 协作”的一体化体验。

> 🔗 **演示视频**：[点击这里查看演示](这里放你的链接)
> 🐛 **问题反馈**：[提交 Issue](这里放你的链接)

---

## ✨ 核心特性 (Core Features)

- 📱 **全栈即时通讯**：基于 Kotlin + Jetpack Compose 构建，采用 MVVM 架构，支持流畅的消息收发、好友与群组管理、未读状态同步。
- ⚡ **高性能实时通信**：基于 WebSocket 实现长连接，支持服务端主动推送与心跳重连，确保消息低延迟到达。
- 🤖 **AI Agent 智能协作**：
  - **群聊总结**：一键提取群聊核心内容，告别信息过载。
  - **待办提取与工具调用**：Agent 通过 **Tool Calling** 识别聊天中的任务信息，并自动调用 Java 后端接口创建任务。
  - **多 Agent 自主对话**：设计独立的 Agent 人格与长期记忆（文件分层存储），支持定时触发自主对话，用户可实时旁观 Agent 的协作演化。
- 🎨 **极简未来主义 UI**：采用 Dark Mode + 玻璃拟态（Glassmorphism）设计，搭配极光紫与深空灰，打造沉浸式 AI 体验。
- 🛠️ **2G 小内存极限调优**：针对阿里云 2核2G ECS 进行极致瘦身（JVM 内存隔离、MySQL 缓冲池限制、Swap 配置），保障微服务架构在极小资源下稳定运行。

---

## 🏗️ 系统架构 (Architecture)

系统采用前后端分离与微服务架构，Java 业务后端与 Python AI 服务解耦，通过内网 HTTP 通信。

```mermaid
flowchart TD
    Client["Android App / Web"] <-->|"WebSocket / HTTP"| Nginx["Nginx 反向代理 / HTTPS"]
    
    Nginx <-->|"路由转发"| Java["Spring Boot 业务后端"]
    Nginx <-->|"路由转发"| Python["Python FastAPI AI 服务"]
    
    Java <-->|"JDBC"| MySQL[("MySQL 持久化")]
    Java <-->|"Cache"| Redis[("Redis 缓存/在线状态")]
    
    Java <-->|"HTTP / Tool Calling"| Python
    Python <-->|"Prompt / RAG"| LLM["云端大模型 API"]
