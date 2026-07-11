# AI单词助手 | AI Vocabulary Learning Assistant

基于AI的智能英语单词学习Web应用，使用DeepSeek API提供个性化单词学习体验。

## 📖 项目介绍

AI单词助手是一款面向英语学习者的智能背单词工具。结合AI生成例句、记忆方法和学习分析，帮助用户高效记忆英语单词。

### 核心功能

- **用户认证** — 注册/登录，JWT身份认证
- **单词学习** — 每日推荐单词，卡片翻转学习模式（认识/模糊/忘记）
- **AI辅助** — DeepSeek驱动的AI例句生成、记忆法生成、学习分析
- **错词本** — 自动记录忘记单词，支持复习和移除
- **学习统计** — 学习数量、掌握数量、错词数量、学习进度

## 🛠 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Next.js | 14 |
| 前端语言 | TypeScript | 5 |
| CSS框架 | Tailwind CSS | 3 |
| HTTP客户端 | Axios | 1 |
| 后端框架 | Flask | 3.1 |
| ORM | SQLAlchemy | 2.0 |
| 认证 | PyJWT | 2.9 |
| 数据库(开发) | SQLite | — |
| 数据库(生产) | MySQL | — |
| AI服务 | DeepSeek API | — |
| 前端部署 | Vercel | — |
| 后端部署 | Render | — |

## 📁 项目目录结构

```
AI-Vocabulary-Assistant/
├── README.md                    # 项目说明文档
├── .gitignore                   # Git忽略配置
│
├── frontend/                    # 前端项目 (Next.js 14)
│   ├── .env.local               # 前端环境变量
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/                 # App Router 页面
│       │   ├── page.tsx         # 首页(重定向)
│       │   ├── layout.tsx       # 根布局
│       │   ├── globals.css      # 全局样式
│       │   ├── login/           # 登录页
│       │   ├── register/        # 注册页
│       │   ├── dashboard/       # 学习仪表盘
│       │   ├── learn/           # 单词学习页
│       │   ├── ai/              # AI助手页
│       │   └── profile/         # 个人中心
│       ├── lib/
│       │   ├── axios.ts         # Axios实例 + 拦截器
│       │   └── auth.ts          # Token管理工具
│       └── types/
│           └── index.ts         # TypeScript类型定义
│
├── backend/                     # 后端项目 (Flask)
│   ├── .env                     # 环境变量(不提交)
│   ├── .env.example             # 环境变量模板
│   ├── requirements.txt         # Python依赖
│   ├── config.py                # 配置管理
│   ├── app.py                   # Flask应用入口
│   ├── extensions.py            # 扩展初始化
│   ├── routes/                  # API路由 (Blueprint)
│   │   └── __init__.py
│   ├── models/                  # 数据库模型
│   │   └── __init__.py
│   ├── services/                # 业务逻辑层
│   │   └── __init__.py
│   └── utils/                   # 工具模块
│       └── __init__.py
│
├── database/                    # 数据库文件
│   └── app.db                   # SQLite数据库(开发)
│
└── docs/                        # 项目文档
    ├── API_DOCS.md              # API接口文档
    └── PROMPT_LOG.md            # AI Prompt日志
```

## 🚀 运行方式

### 环境要求

- Node.js >= 18
- Python >= 3.10
- npm

### 后端启动

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境（推荐）
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 配置环境变量（复制 .env.example 为 .env 并修改）
cp .env.example .env

# 5. 启动Flask开发服务器
python app.py
# 访问 http://localhost:5000/api/health 验证
```

### 前端启动

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 一键启动开发环境

```bash
# 终端1 — 启动后端
cd backend && python app.py

# 终端2 — 启动前端
cd frontend && npm run dev
```

## 📊 开发状态

| Phase | 内容 | 状态 |
|-------|------|------|
| Phase 1 | 项目初始化 & 基础搭建 | ✅ 完成 |
| Phase 2 | 用户认证模块 | 🚧 待开发 |
| Phase 3 | 单词学习模块 | 🚧 待开发 |
| Phase 4 | AI辅助模块 | 🚧 待开发 |
| Phase 5 | 学习统计 & 部署 | 🚧 待开发 |

## 📝 API健康检查

```bash
curl http://localhost:5000/api/health
# {"code":0,"data":{"status":"healthy","version":"0.1.0"},"message":"ok"}
```

## 📄 License

MIT License — 课程设计项目
