from datetime import datetime, date
from extensions import db


class StudyRecord(db.Model):
    """学习记录模型"""
    __tablename__ = 'study_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'known' | 'fuzzy' | 'forgot'
    study_time = db.Column(db.Date, nullable=False, default=date.today)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'word_id', 'study_time', name='uq_study_record'),
        db.Index('idx_study_user_date', 'user_id', 'study_time'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'word_id': self.word_id,
            'status': self.status,
            'study_time': self.study_time.isoformat() if self.study_time else None,
            'word': self.word.to_dict() if self.word else None,
        }

    def __repr__(self):
        return f'<StudyRecord user={self.user_id} word={self.word_id} status={self.status}>'
