# AI单词助手 | AI Vocabulary Learning Assistant

基于 DeepSeek 大语言模型的智能英语单词学习 Web 应用。

## 项目介绍

AI单词助手是一款面向英语学习者的智能背单词工具。结合 DeepSeek AI 生成例句、记忆方法和学习分析，帮助用户高效记忆英语单词。支持闪卡学习、智能错词推荐、学习结果纠错等创新功能。

## 核心功能

### 1. 用户系统
- 注册 / 登录 / JWT 身份认证
- 个人中心展示学习数据和进度

### 2. 智能背词
- 闪卡学习模式（CSS 3D 翻转动画）
- 认识 / 模糊 / 忘记 三种评价
- 评价后自动翻转查看答案
- 二次确认（记错了可即时修正）

### 3. 学习纠错机制
- 查看答案后可修改学习结果
- known → forgot 即时修正
- 避免误判，保证学习数据准确

### 4. 错词系统
- 忘记自动加入错词本
- 智能优先级排序推荐
- 三种复习模式：普通 / 困难词优先 / 全部

### 5. AI 功能（DeepSeek）
- AI 例句生成（英文例句 + 中文翻译）
- AI 记忆法生成（词根分析 + 联想记忆）
- AI 学习分析（薄弱点 + 改进建议）
- AI 复习总结（复习结果分析 + 下一步计划）

### 6. 统计系统
- 学习数量 / 掌握数量 / 错词统计
- 7天学习趋势柱状图
- 学习天数 + 正确率

## 项目创新点

1. **AI 大模型辅助学习** — DeepSeek 为每个单词生成个性化例句和记忆法
2. **智能错词推荐算法** — priority_score = wrong_count × 0.5 + days_since × 0.3 + difficulty × 0.2
3. **学习数据闭环** — 学习 → 记录 → 错词 → 复习 → 统计 → 分析
4. **学习结果纠错机制** — 评价后可修正，保证数据准确性

## 技术架构

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 + React + TypeScript + Tailwind CSS + Recharts |
| 后端 | Python Flask + Blueprint + SQLAlchemy |
| 数据库 | SQLite（开发）/ PostgreSQL（生产） |
| AI | DeepSeek API (deepseek-chat) |
| 认证 | PyJWT 无状态 Token |
| 部署 | 前端 Vercel / 后端 Render |

## 项目目录结构

```
AI-Vocabulary-Assistant/
├── README.md
├── .gitignore
├── frontend/                     # Next.js 14 前端
│   ├── src/app/                  # 页面路由
│   │   ├── login/                # 登录
│   │   ├── register/             # 注册
│   │   ├── dashboard/            # 仪表盘
│   │   ├── learn/                # 单词学习
│   │   ├── ai/                   # AI助手
│   │   ├── profile/              # 个人中心
│   │   └── wrong/                # 错词本 + 复习
│   └── src/components/           # 通用组件
│       ├── Button.tsx            # 按钮
│       ├── Card.tsx              # 卡片
│       ├── Loading.tsx           # 加载
│       ├── Modal.tsx             # 弹窗
│       ├── FlashCard.tsx         # 闪卡
│       ├── Navbar.tsx            # 导航
│       ├── Skeleton.tsx          # 骨架屏
│       ├── Toast.tsx             # 通知
│       └── Icon/                 # SVG图标
├── backend/                      # Flask 后端
│   ├── app.py                    # 入口
│   ├── config.py                 # 配置
│   ├── routes/                   # API路由
│   │   ├── auth.py               # 认证
│   │   ├── words.py              # 单词
│   │   ├── study.py              # 学习
│   │   ├── wrong_words.py        # 错词
│   │   ├── ai.py                 # AI
│   │   └── statistics.py         # 统计
│   ├── models/                   # 数据模型
│   ├── services/                 # 业务逻辑
│   └── utils/                    # 工具
├── database/                     # SQLite数据
└── docs/                         # 项目文档
    ├── README.md
    ├── FEATURE_LIST.md
    ├── API_DOCUMENT.md
    ├── DATABASE_DESIGN.md
    ├── AI_PROMPT_LOG.md
    ├── DEVELOPMENT_HISTORY.md
    └── PROJECT_SUMMARY.md
```

## 运行方式

### 环境要求
- Node.js >= 18
- Python >= 3.10

### 后端启动

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env    # 填入 DEEPSEEK_API_KEY
python app.py           # http://localhost:5000
```

### 前端启动

```bash
cd frontend
npm install
npm run dev             # http://localhost:3000
```

## 部署方式

| 服务 | 平台 | 说明 |
|------|------|------|
| 前端 | Vercel | root=frontend, 自动部署 |
| 后端 | Render | root=backend, Procfile: `web: gunicorn app:create_app()` |

### 环境变量

| 变量 | 说明 |
|------|------|
| `FLASK_ENV` | production |
| `JWT_SECRET_KEY` | 随机字符串 |
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 |
| `DATABASE_URL` | Render 自动注入 PostgreSQL |
| `NEXT_PUBLIC_API_URL` | 后端地址 |

## 开发状态

| 阶段 | 内容 | 状态 |
|------|------|------|
| 第一阶段 | 项目初始化 & 基础架构搭建 | ✅ 完成 |
| 第二阶段 | 用户认证系统 | ✅ 完成 |
| 第三阶段 | 单词学习闭环 | ✅ 完成 |
| 第四阶段 | DeepSeek AI辅助模块 | ✅ 完成 |
| 第五阶段 | 学习统计系统 | ✅ 完成 |
| 第六阶段 | UI图标系统升级 | ✅ 完成 |
| 第六阶段扩展 | 错词复习 + 智能排序 + AI复习分析 | ✅ 完成 |
| 第七阶段 | 部署与体验优化 | ✅ 完成 |
| 第八阶段 | 项目文档整理 | ✅ 完成 |

## API 健康检查

```bash
curl http://localhost:5000/api/health
# {"code":0,"data":{"status":"healthy","version":"1.0.0"},"message":"ok"}
```

## License

MIT License — 课程设计项目
