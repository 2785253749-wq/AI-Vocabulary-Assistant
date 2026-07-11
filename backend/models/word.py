from datetime import datetime
from extensions import db


class Word(db.Model):
    """单词模型"""
    __tablename__ = 'words'

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), unique=True, nullable=False, index=True)
    phonetic = db.Column(db.String(100))
    meaning = db.Column(db.Text, nullable=False)
    example = db.Column(db.Text)
    difficulty = db.Column(db.Integer, default=1)  # 1=简单 2=中等 3=困难
    created_time = db.Column(db.DateTime, default=datetime.utcnow)

    # 关联
    study_records = db.relationship('StudyRecord', backref='word', lazy='dynamic')
    wrong_words = db.relationship('WrongWord', backref='word', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'word': self.word,
            'phonetic': self.phonetic or '',
            'meaning': self.meaning,
            'example': self.example or '',
            'difficulty': self.difficulty,
        }

    def __repr__(self):
        return f'<Word {self.word}>'
