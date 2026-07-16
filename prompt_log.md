# AI Vocabulary Assistant Prompt Log

> 本项目所有 AI 功能基于 DeepSeek API (`deepseek-chat`) 实现，通过 Prompt Engineering 优化不同场景的输出效果。

---

## 1. AI例句生成（AI Example Generation）

### 功能描述

用户输入英语单词，调用 DeepSeek 生成符合大学英语四级学习难度的英文例句，并提供中文翻译。

### 调用接口

```
POST /api/v1/ai/example
```

### Prompt 模板

```
你是一名英语教师，帮助学生准备大学英语四级考试。
请为单词 "{word}"（释义：{meaning}）生成1个简单的英文例句和中文翻译。
要求：例句长度15个单词以内，使用日常场景。
请严格按JSON格式返回，不要包含任何其他文字：
{"sentence":"...","translation":"..."}
```

### 输入示例

```json
{
  "word": "environment",
  "meaning": "环境"
}
```

### 输出示例

```json
{
  "word": "environment",
  "sentence": "We must protect the environment for future generations.",
  "translation": "我们必须为子孙后代保护环境。"
}
```

---

## 2. AI记忆法生成（AI Memory Method）

### 功能描述

利用 DeepSeek 分析单词的词根词缀构词方式，并生成联想记忆方法和快速记忆技巧。

### 调用接口

```
POST /api/v1/ai/memory
```

### Prompt 模板

```
你是一名英语词汇记忆专家。请为单词 "{word}"（释义：{meaning}）生成记忆方法。
要求：
1. 词根分析：拆解单词的词根、前缀、后缀，并解释含义
2. 联想记忆：提供1个生动有趣的联想记忆方式
请严格按JSON格式返回，不要包含任何其他文字：
{"root":"词根分析...","memory":"联想记忆..."}
```

### 输入示例

```json
{
  "word": "beautiful"
}
```

### 输出示例

```json
{
  "word": "beautiful",
  "root": "词根 'beau'（法语，意为'美丽的'）+ 后缀 '-tiful'（来自 '-ful'，意为'充满...的'），字面意思为'充满美丽的'。",
  "memory": "谐音记忆：'比藕提福' — 比莲藕还提神有福气，就是 beautiful（美丽的）。"
}
```

---

## 3. AI学习情况分析（AI Learning Analysis）

### 功能描述

根据用户近期学习记录（7天数据），分析学习表现、薄弱词汇类型，并给出改进建议。

### 调用接口

```
POST /api/v1/ai/analyze
```

### Prompt 模板

```
你是一名学习分析专家。根据以下数据给出学习建议（不超过150字）。
数据：
- 总学习单词数：{total_learned}
- 认识数量：{known_count}
- 忘记数量：{forgot_count}
- 薄弱单词：{weak_words}
要求：鼓励性语气，给出具体改进建议。
请严格按JSON格式返回，不要包含任何其他文字：
{"analysis":"..."}
```

### 输入示例

```json
{
  "total_learned": 45,
  "known_count": 30,
  "forgot_count": 8,
  "weak_words": ["abandon", "brilliant", "circumstance"]
}
```

### 输出示例

```
学习进度良好，已掌握30个单词。薄弱环节集中在以'a'和'c'开头的抽象名词。
建议每天重点复习3-5个薄弱词，结合AI记忆法加深印象，并尝试造句练习。
```

---

## 4. AI错词复习分析（AI Review Analysis）

### 功能描述

根据用户本次错词复习结果，生成个性化复习总结、薄弱点分析、学习建议和下一步计划。

### 调用接口

```
POST /api/v1/ai/review-analysis
```

### Prompt 模板

```
你是一名英语学习指导老师。请根据用户本次错词复习结果，给出个性化分析。
复习数据：
- 复习单词数：{total}
- 掌握：{known} 个
- 忘记：{forgot} 个
- 模糊：{fuzzy} 个
- 高优先级错词：{high_priority_words}
- 错误最多的词：{most_wrong_words}
要求：分析学习表现、指出薄弱词汇类型、分析遗忘原因、给出下一步建议。
限制200字以内，鼓励性语气。
请严格按JSON格式返回，不要包含任何其他文字：
{"summary":"一句话总结","weakness":"薄弱点分析","suggestion":"学习建议","next_plan":"下一步计划"}
```

### 输入示例

```json
{
  "total": 6,
  "known": 3,
  "forgot": 1,
  "fuzzy": 2,
  "high_priority_words": ["abundant", "academic"],
  "most_wrong_words": ["abundant", "academic", "command"]
}
```

### 输出示例

```json
{
  "summary": "本次复习6个单词，掌握3个，模糊2个，遗忘1个，表现良好。",
  "weakness": "薄弱点集中在抽象形容词和学术词汇，如abundant、academic等。",
  "suggestion": "建议使用词根词缀法拆解记忆，如 abundant = ab- + und + ant，并结合例句加深理解。",
  "next_plan": "针对高优先级错词，建议在第1天、第3天和第7天分别再次复习，强化记忆效果。"
}
```

---

## Prompt 设计说明

本项目通过 Prompt Engineering 优化 DeepSeek AI 输出效果，针对不同功能场景使用不同的 Prompt 策略：

| 功能 | Prompt 策略 | 侧重点 |
|------|------------|--------|
| 例句生成 | 角色扮演（英语教师）+ 难度约束（CET-4） | 语言准确性与场景真实性 |
| 记忆法生成 | 角色扮演（词汇专家）+ 结构拆解要求 | 词根分析与联想创意 |
| 学习分析 | 角色扮演（分析专家）+ 数据驱动 + 字数限制 | 数据总结与鼓励性反馈 |
| 复习分析 | 角色扮演（规划助手）+ 多维度输出 | 个性化建议与可执行计划 |

### 技术参数

- 模型：`deepseek-chat`
- Temperature：`0.7`
- Max Tokens：`800`
- 超时：30秒
- 输出格式：统一要求 JSON，前端解析后展示

### AI 调用记录

所有 AI 调用结果自动保存到 `ai_records` 表：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户 ID |
| word | VARCHAR | 输入单词 |
| type | VARCHAR | example / memory / analyze / review_analysis |
| prompt | TEXT | 发送给 AI 的完整 Prompt |
| content | TEXT | AI 返回的 JSON 内容 |
| created_time | DATETIME | 调用时间 |

可通过查询 `ai_records` 表审计所有 AI 调用历史，分析 Prompt 效果并持续优化。
