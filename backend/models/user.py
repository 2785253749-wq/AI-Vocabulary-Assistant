from datetime import datetime
from extensions import db


class User(db.Model):
    """用户模型"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_time = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """序列化为字典（不含敏感信息）"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_time': self.created_time.isoformat() if self.created_time else None,
        }

    def __repr__(self):
        return f'<User {self.username}>'
