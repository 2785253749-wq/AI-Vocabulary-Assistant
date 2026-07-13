"""
错词复习优先级算法
priority_score = wrong_count * 0.5 + days_since_last_review * 0.3 + difficulty_score * 0.2
"""
from datetime import date, timedelta
from models.wrong_word import WrongWord
from models.study_record import StudyRecord
from models.word import Word
from extensions import db


class WrongReviewService:

    @staticmethod
    def calculate_priority(word_id: int, user_id: int, wrong_count: int = 0) -> float:
        """
        计算单个单词的复习优先级分数
        - wrong_count: 错误次数（权重0.5）
        - days_since_last_review: 距上次复习天数（权重0.3）
        - difficulty: 单词难度（权重0.2）
        """
        # 1. 错误次数得分
        wrong_score = wrong_count * 0.5

        # 2. 距上次复习天数
        last_review = StudyRecord.query.filter(
            StudyRecord.user_id == user_id,
            StudyRecord.word_id == word_id,
        ).order_by(StudyRecord.study_time.desc()).first()

        if last_review:
            days_since = (date.today() - last_review.study_time).days
        else:
            days_since = 30  # 从未复习过，默认30天

        days_score = min(days_since, 30) * 0.3  # 上限30天

        # 3. 难度得分
        word = Word.query.get(word_id)
        difficulty = word.difficulty if word else 1
        difficulty_score = difficulty * 0.2

        return round(wrong_score + days_score + difficulty_score, 1)

    @staticmethod
    def get_review_words_prioritized(user_id: int, mode: str = 'normal') -> dict:
        """
        获取排序后的错词复习列表
        mode: normal(按优先级排序) | hard(仅高优先级) | all(全部)
        """
        items = WrongWord.query.filter_by(user_id=user_id).all()

        if not items:
            return {'total': 0, 'words': []}

        # 计算每个错词的优先级
        word_list = []
        scores = []

        for item in items:
            w = item.word
            if not w:
                continue
            score = WrongReviewService.calculate_priority(w.id, user_id, item.wrong_count)
            word_data = {
                'wrong_id': item.id,
                'word_id': w.id,
                'word': w.word,
                'phonetic': w.phonetic or '',
                'meaning': w.meaning,
                'example': w.example or '',
                'wrong_count': item.wrong_count,
                'priority_score': score,
                'priority_level': WrongReviewService._level(score),
            }
            word_list.append(word_data)
            scores.append(score)

        # 按score降序
        word_list.sort(key=lambda x: x['priority_score'], reverse=True)

        # 模式筛选
        if mode == 'hard':
            avg = sum(scores) / len(scores) if scores else 0
            word_list = [w for w in word_list if w['priority_score'] > avg]
        # normal 和 all 都返回全部（normal已排序）

        return {'total': len(word_list), 'words': word_list}

    @staticmethod
    def _level(score: float) -> str:
        """优先级等级"""
        if score >= 7:
            return 'high'    # 重点
        elif score >= 4:
            return 'medium'  # 加强
        return 'low'         # 普通
