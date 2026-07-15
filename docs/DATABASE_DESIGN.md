# 数据库设计

## ER 关系

```
User 1──N StudyRecord N──1 Word
User 1──N WrongWord   N──1 Word
User 1──N AIRecord
```

---

## User（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| username | VARCHAR(50) UNIQUE | 用户名 |
| email | VARCHAR(100) UNIQUE | 邮箱 |
| password_hash | VARCHAR(255) | 密码哈希（werkzeug） |
| created_time | DATETIME | 注册时间 |

---

## Word（单词表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| word | VARCHAR(100) UNIQUE | 单词 |
| phonetic | VARCHAR(100) | 音标 |
| meaning | TEXT | 中文释义 |
| example | TEXT | 例句 |
| difficulty | INTEGER | 难度（1=简单 2=中等 3=困难） |
| created_time | DATETIME | 创建时间 |

预置 132 个 CET-4 单词。

---

## StudyRecord（学习记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| user_id | INTEGER FK→User | 用户 |
| word_id | INTEGER FK→Word | 单词 |
| status | VARCHAR(20) | known / fuzzy / forgot |
| study_time | DATE | 学习日期 |

唯一约束：(user_id, word_id, study_time)

---

## WrongWord（错词本表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| user_id | INTEGER FK→User | 用户 |
| word_id | INTEGER FK→Word | 单词 |
| wrong_count | INTEGER | 错误次数 |
| created_time | DATETIME | 首次加入时间 |

唯一约束：(user_id, word_id)

---

## AIRecord（AI记录表 / Prompt 日志）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| user_id | INTEGER FK→User | 用户 |
| word | VARCHAR(100) | 单词 |
| type | VARCHAR(20) | example / memory / analyze / review_analysis |
| prompt | TEXT | 发送的 Prompt |
| content | TEXT | AI 返回的 JSON |
| created_time | DATETIME | 调用时间 |

---

## 索引策略

```sql
-- 学习记录查询
CREATE INDEX idx_study_user_date ON study_records(user_id, study_time);
CREATE UNIQUE INDEX uq_study_record ON study_records(user_id, word_id, study_time);

-- 错词本查询
CREATE UNIQUE INDEX uq_wrong_word ON wrong_words(user_id, word_id);

-- AI记录查询
CREATE INDEX idx_ai_records_user ON ai_records(user_id, created_time);
```
