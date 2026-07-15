# 开发历史

## Phase 1 — 项目初始化与基础工程搭建

**目标**: 搭建前后端脚手架

- 初始化 Next.js 14 + TypeScript + Tailwind CSS 项目
- 初始化 Flask + Blueprint + SQLAlchemy 项目
- 创建 6 个页面框架
- 配置 Axios + JWT 拦截器
- 定义 TypeScript 类型

## Phase 2 — 用户认证系统

**目标**: 实现注册登录

- User 模型（id/username/email/password_hash）
- JWT Token 生成与验证
- @login_required 装饰器
- POST /auth/register + POST /auth/login + GET /auth/me
- 登录页 + 注册页完整表单

## Phase 3 — 核心单词学习系统

**目标**: 实现单词学习和错词本

- Word / StudyRecord / WrongWord 模型
- 导入 132 个 CET-4 单词
- 闪卡学习（CSS 3D 翻转）+ 认识/模糊/忘记
- 忘记自动加入错词本
- 错词本列表 + 删除

## Phase 4 — AI 辅助模块接入

**目标**: DeepSeek API 集成

- AIRecord 模型（Prompt 日志）
- AI 例句生成 + AI 记忆法生成 + AI 学习分析
- 学习页快捷 AI 按钮 + 独立 AI 助手页
- 完整异常处理（超时/401/429/网络错误）

## Phase 5 — 学习统计模块

**目标**: 数据可视化

- GET /statistics 接口（7天趋势/累计/掌握/错词）
- Dashboard 重写（4个数据卡片 + Recharts 柱状图）
- 个人中心升级（学习天数 + 进度条）

## Phase 6 — UI 优化 + 代码质量

**目标**: 统一组件和图标

- Button/Card/Loading/Modal 4个通用组件
- SVG Icon 组件（15个线性图标）
- 全部 emoji 替换为 Icon 组件
- 代码审查 + 移除未使用导入

## Phase 6.5 — 错词复习升级

**目标**: 错词复习闭环

- 6.5-1: 错词复习闪卡模式 + 复习统计
- 6.5-2: 智能排序算法（优先级 = wrong_count×0.5 + days×0.3 + difficulty×0.2）
- 6.5-3: AI 复习分析（4段式总结/薄弱点/建议/下一步计划）

## Phase 7 — 部署准备

**目标**: 生产环境配置

- gunicorn + Procfile
- Render/PostgreSQL 适配
- .env.production + 环境变量整理

## Phase 7.5 — 最终体验优化

**目标**: 交互细节打磨

- 全局 Toast 通知系统
- Skeleton Loading 骨架屏
- 登录/注册成功提示

## Phase 7.6 — 学习交互优化

**目标**: 二次确认机制

- 7.6-1: 评价后卡片翻转 → 显示答案 → 点击继续
- 7.6-2: "记错了"按钮 + PUT /study/revise-result
- 7.6-3: 错词复习同步确认流程

## Phase 8 — 代码审查 + 文档

**目标**: 项目收尾

- 8.1: 最终代码审查（质量/安全/API一致性）
- 8.2: 完整项目文档（7份）
