# AI Vocabulary Assistant

> 基于 DeepSeek 大语言模型的智能英语学习助手

## 项目背景

英语学习中，单词记忆是最大的痛点。传统背单词软件缺少智能反馈和个性化指导。本项目利用 DeepSeek 大模型，为每个单词提供 AI 生成的例句和记忆方法，动态分析学习习惯，实现真正的智能单词学习。

## 设计目标

- 提供完整的单词学习闭环：学习 → 记录 → 复习 → 统计
- DeepSeek AI 辅助生成例句、记忆法、学习分析
- 智能错词排序推荐，优先复习最易遗忘的单词
- 学习结果二次确认，保证数据准确性

## 核心功能

| 模块 | 功能 |
|------|------|
| 用户认证 | 注册 / 登录 / JWT |
| 单词学习 | 闪卡翻转 / 认识·模糊·忘记 / 答案确认 / 结果纠错 |
| 错词复习 | 错词本 / 智能优先级排序 / 困难词优先 / AI 复习分析 |
| AI 辅助 | DeepSeek 生成例句·记忆法·学习分析·复习总结 |
| 学习统计 | 仪表盘 / 7天趋势 / 正确率 |

## 技术架构

```
Frontend: Next.js 14 + React + TypeScript + Tailwind CSS + Recharts
   ↕ Axios + JWT
Backend:  Flask + Blueprint + SQLAlchemy + PyJWT
   ↕                                 ↕
SQLite/MySQL                 DeepSeek API (chat/completions)
```

## 运行方式

### 后端

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # 编辑填入 DEEPSEEK_API_KEY
python app.py                  # http://localhost:5000
```

### 前端

```bash
cd frontend
npm install
npm run dev                    # http://localhost:3000
```

## 部署方式

| 服务 | 平台 | 说明 |
|------|------|------|
| 前端 | Vercel | 连接 GitHub，root=frontend，自动部署 |
| 后端 | Render | Web Service，root=backend，Procfile 启动 |
| 数据库 | Render PostgreSQL | 自动注入 DATABASE_URL |

### 环境变量

```
FLASK_ENV=production
JWT_SECRET_KEY=<random>
DEEPSEEK_API_KEY=sk-...
NEXT_PUBLIC_API_URL=https://xxx.onrender.com
```
