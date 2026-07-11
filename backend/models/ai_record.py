from datetime import datetime
from extensions import db


class AIRecord(db.Model):
    """AI生成记录模型 — 保存Prompt日志和生成历史"""
    __tablename__ = 'ai_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    word = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'example' | 'memory' | 'analyze'
    prompt = db.Column(db.Text)                       # 发送的prompt
    content = db.Column(db.Text)                      # AI返回的内容(JSON字符串)
    created_time = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.Index('idx_ai_records_user', 'user_id', 'created_time'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'word': self.word,
            'type': self.type,
            'content': self.content,
            'created_time': self.created_time.isoformat() if self.created_time else None,
        }

    def __repr__(self):
        return f'<AIRecord {self.type} {self.word}>'
