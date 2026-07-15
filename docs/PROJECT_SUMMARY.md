# 项目总结

## 项目概况

**AI Vocabulary Assistant** 是一款基于 DeepSeek 大语言模型的智能英语单词学习 Web 应用。通过 AI 生成的例句、记忆法和学习分析，为用户提供个性化的单词学习体验。

## 技术路线

| 层级 | 技术选型 | 理由 |
|------|---------|------|
| 前端 | Next.js 14 + TypeScript + Tailwind CSS | 类型安全、原子化CSS、Vercel一键部署 |
| 后端 | Flask + Blueprint + SQLAlchemy | 轻量灵活、Blueprint模块化、ORM切换 |
| AI | DeepSeek API (chat/completions) | 性价比高、中文能力强、OpenAI兼容 |
| 数据 | SQLite(dev) / PostgreSQL(prod) | 开发零配置、生产高性能 |
| 部署 | Vercel + Render | 免费额度充足、GitHub集成 |

## 架构亮点

```
Browser → Next.js 14 (SSR/CSR)
   ↕ REST API + JWT Auth
Flask Blueprint → SQLAlchemy ORM
   ↕                ↕
DeepSeek API    SQLite / PostgreSQL
```

- **前后端分离**: 独立部署、独立扩展
- **Blueprint 模块化**: auth / words / study / wrong / ai / statistics 6个模块
- **三层架构**: routes → services → models
- **AI Prompt 管理**: 所有调用记录到 ai_records 表，可审计、可复现

## 四大创新点

### 1. DeepSeek AI 辅助学习

每个单词支持 AI 生成例句（含中文翻译）和记忆法（词根分析 + 联想记忆）。学习后 AI 分析薄弱点并给出针对性建议。错词复习后 AI 总结表现并制定下一步计划。

### 2. 智能错词推荐算法

```
priority_score = wrong_count × 0.5 + days_since_last_review × 0.3 + difficulty × 0.2
```

三种复习模式：普通（按优先级排序）、困难词优先（仅高优先级）、全部复习。

### 3. 学习数据闭环

```
学习 → 记录 → 错词 → 复习 → 统计 → 分析 → 优化学习策略
```

每个环节的数据都被追踪和利用，形成完整的学习反馈循环。

### 4. 学习结果纠错机制

用户评价后卡片自动翻转显示正确答案，若发现选择错误可通过"记错了"按钮即时修正（Known → Forgot），确保学习数据的准确性。

## 项目数据

| 指标 | 数值 |
|------|------|
| 前端页面 | 14个路由 |
| 后端 API | 16个接口 |
| 数据库表 | 5张 |
| 组件数 | 12个 |
| 预置单词 | 132个 (CET-4) |
| SVG 图标 | 15个 |
| Git 提交 | 15+ |
| 开发周期 | 8个 Phase |

## 技术栈完整清单

**前端**: Next.js 14, React 18, TypeScript 5, Tailwind CSS 3, Axios, Recharts

**后端**: Python 3.10+, Flask 3.1, Flask-CORS, Flask-SQLAlchemy, PyJWT, Werkzeug, gunicorn, requests

**AI**: DeepSeek API (deepseek-chat model)

**数据库**: SQLite (dev), PostgreSQL via Render (prod)

**部署**: Vercel (frontend), Render (backend)
