from datetime import datetime
from extensions import db


class WrongWord(db.Model):
    """错词本模型"""
    __tablename__ = 'wrong_words'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)
    wrong_count = db.Column(db.Integer, default=1)
    created_time = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'word_id', name='uq_wrong_word'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'word_id': self.word_id,
            'wrong_count': self.wrong_count,
            'created_time': self.created_time.isoformat() if self.created_time else None,
            'word': self.word.to_dict() if self.word else None,
        }

    def __repr__(self):
        return f'<WrongWord user={self.user_id} word={self.word_id}>'
