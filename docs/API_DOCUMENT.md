# API 接口文档

## 通用规范

- Base URL: `/api/v1`
- 认证: `Authorization: Bearer <token>`
- Content-Type: `application/json`

## 响应格式

```json
{ "code": 0, "message": "ok", "data": {} }
```

| code | 说明 |
|------|------|
| 0 | 成功 |
| 1000 | 参数错误 |
| 1001 | 未认证 |
| 1003 | 资源不存在 |
| 2000 | 服务器错误 |
| 2001 | AI 服务错误 |

---

## 1. 认证模块 (auth)

### POST /auth/register — 注册
```
Body: { "username": "alice", "email": "a@test.com", "password": "123456" }
Response 201: { "code": 0, "data": { "id": 1, "username": "alice", "email": "a@test.com" } }
```

### POST /auth/login — 登录
```
Body: { "username": "alice", "password": "123456" }
Response 200: { "code": 0, "data": { "access_token": "eyJ...", "user": {...} } }
```

### GET /auth/me — 当前用户
```
Header: Authorization: Bearer <token>
Response 200: { "code": 0, "data": { "id": 1, "username": "alice", "email": "a@test.com" } }
```

---

## 2. 单词模块 (words)

### GET /words/today — 今日单词
```
Query: ?count=10
Response 200: { "code": 0, "data": { "words": [{ "id": 1, "word": "abandon", "phonetic": "...", "meaning": "放弃", "example": "...", "study_status": null }] } }
```

### GET /words/<id> — 单词详情

---

## 3. 学习记录 (study)

### POST /study/record — 提交学习结果
```
Body: { "word_id": 1, "status": "known" }
Response 200: { "code": 0, "data": { "record_id": 1, "is_wrong_word": false } }
```

### PUT /study/revise-result — 修正结果
```
Body: { "word_id": 1, "old_status": "known", "new_status": "forgot" }
Response 200: { "code": 0, "data": { "is_wrong_word": true } }
```

---

## 4. 错词本 (wrong)

### GET /wrong/list — 错词列表
```
Response 200: { "code": 0, "data": { "total": 5, "items": [{ "id": 1, "word": {...} }] } }
```

### GET /wrong/review?mode=normal — 复习列表
```
Query: mode=normal|hard|all
Response 200: { "code": 0, "data": { "words": [{ "word_id": 1, "priority_score": 8.6, "priority_level": "high" }] } }
```

### POST /wrong/review — 提交复习
```
Body: { "word_id": 1, "status": "known" }
Response 200: { "code": 0, "data": { "removed": true, "remaining_wrong": 4 } }
```

### GET /wrong/review/statistics — 复习统计
```
Response 200: { "code": 0, "data": { "total": 10, "finished": 6, "known": 4, "forgot": 1, "accuracy": 80 } }
```

### DELETE /wrong/<id> — 删除错词

---

## 5. AI 模块 (ai)

### POST /ai/example — AI例句
```
Body: { "word": "abandon", "meaning": "放弃" }
Response 200: { "code": 0, "data": { "word": "abandon", "sentence": "...", "translation": "..." } }
```

### POST /ai/memory — AI记忆法
```
Body: { "word": "beautiful" }
Response 200: { "code": 0, "data": { "word": "beautiful", "root": "词根分析...", "memory": "联想记忆..." } }
```

### POST /ai/analyze — AI学习分析
```
Body: {}
Response 200: { "code": 0, "data": { "analysis": "..." } }
```

### POST /ai/review-analysis — AI复习分析
```
Body: { "total": 6, "known": 3, "forgot": 1, "fuzzy": 2 }
Response 200: { "code": 0, "data": { "summary": "...", "weakness": "...", "suggestion": "...", "next_plan": "..." } }
```

---

## 6. 统计 (statistics)

### GET /statistics — 学习统计
```
Response 200: { "code": 0, "data": { "total_words": 50, "known_words": 30, "forgot_words": 5, "today_count": 10, "study_days": 7, "week_data": [{ "date": "...", "known": 5, "forgot": 1 }] } }
```
