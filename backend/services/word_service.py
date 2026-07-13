from datetime import date
from models.word import Word
from models.study_record import StudyRecord
from models.wrong_word import WrongWord
from extensions import db


class WordService:
    """单词服务"""

    @staticmethod
    def get_today_words(user_id: int, count: int = 10) -> list[dict]:
        """
        获取用户今日学习单词列表
        优先返回今日未学过的单词，不足时补充已学单词以供复习
        """
        today = date.today()

        # 今天已学过的word_id
        studied_today = db.session.query(StudyRecord.word_id).filter(
            StudyRecord.user_id == user_id,
            StudyRecord.study_time == today,
        ).all()
        studied_ids = {r[0] for r in studied_today}

        # 优先：今日未学过的单词
        words = Word.query.filter(Word.id.notin_(studied_ids)).order_by(Word.difficulty, Word.id).limit(count).all()

        # 如果未学过的不够，补充已学过的
        if len(words) < count:
            remaining = count - len(words)
            reviewed = Word.query.filter(Word.id.in_(studied_ids)).order_by(Word.id).limit(remaining).all()
            words += reviewed

        result = []
        for w in words:
            d = w.to_dict()
            # 查询今日学习状态
            record = StudyRecord.query.filter_by(
                user_id=user_id, word_id=w.id, study_time=today
            ).first()
            d['study_status'] = record.status if record else None
            result.append(d)

        return result

    @staticmethod
    def get_word_detail(word_id: int) -> dict | None:
        """获取单词详情"""
        word = Word.query.get(word_id)
        return word.to_dict() if word else None


class StudyService:
    """学习记录服务"""

    VALID_STATUSES = ('known', 'fuzzy', 'forgot')

    @staticmethod
    def record_study(user_id: int, word_id: int, status: str) -> tuple[dict | None, str | None]:
        """
        记录学习结果
        status='forgot' 时自动加入错词本
        """
        if status not in StudyService.VALID_STATUSES:
            return None, f'无效的学习状态，可选值: {", ".join(StudyService.VALID_STATUSES)}'

        word = Word.query.get(word_id)
        if not word:
            return None, '单词不存在'

        today = date.today()

        # 查找今日是否已有记录（允许覆盖）
        record = StudyRecord.query.filter_by(
            user_id=user_id, word_id=word_id, study_time=today
        ).first()

        if record:
            old_status = record.status
            record.status = status
        else:
            old_status = None
            record = StudyRecord(
                user_id=user_id,
                word_id=word_id,
                status=status,
                study_time=today,
            )
            db.session.add(record)

        # 处理错词本逻辑
        is_wrong = False
        wrong_word = WrongWord.query.filter_by(user_id=user_id, word_id=word_id).first()

        if status == 'forgot':
            if wrong_word:
                wrong_word.wrong_count += 1
            else:
                wrong_word = WrongWord(user_id=user_id, word_id=word_id)
                db.session.add(wrong_word)
            is_wrong = True
        elif status == 'known' and wrong_word:
            # 认识 → 从错词本移除
            db.session.delete(wrong_word)
            is_wrong = False

        db.session.commit()

        return {
            'record_id': record.id,
            'word_id': word_id,
            'status': status,
            'old_status': old_status,
            'is_wrong_word': is_wrong,
        }, None


class WrongWordService:
    """错词本服务"""

    @staticmethod
    def get_wrong_list(user_id: int) -> list[dict]:
        """获取用户错词列表"""
        items = WrongWord.query.filter_by(user_id=user_id).order_by(WrongWord.created_time.desc()).all()
        return [item.to_dict() for item in items]

    @staticmethod
    def delete_wrong(wrong_id: int, user_id: int) -> tuple[bool, str | None]:
        """删除错词记录"""
        item = WrongWord.query.filter_by(id=wrong_id, user_id=user_id).first()
        if not item:
            return False, '错词记录不存在'
        db.session.delete(item)
        db.session.commit()
        return True, None

    @staticmethod
    def get_review_words(user_id: int) -> dict:
        """获取错词复习列表"""
        items = WrongWord.query.filter_by(user_id=user_id).order_by(WrongWord.wrong_count.desc()).all()
        words = []
        for item in items:
            w = item.word
            if w:
                words.append({
                    'wrong_id': item.id,
                    'word_id': w.id,
                    'word': w.word,
                    'phonetic': w.phonetic or '',
                    'meaning': w.meaning,
                    'example': w.example or '',
                    'wrong_count': item.wrong_count,
                })
        return {'total': len(words), 'words': words}

    @staticmethod
    def submit_review(user_id: int, word_id: int, status: str) -> tuple[dict | None, str | None]:
        """
        提交错词复习结果
        known: 删除错词 + 创建StudyRecord
        fuzzy: 保留错词 + 创建StudyRecord
        forgot: wrong_count+1 + 创建StudyRecord
        """
        from datetime import date

        if status not in ('known', 'fuzzy', 'forgot'):
            return None, '无效状态'

        wrong_word = WrongWord.query.filter_by(user_id=user_id, word_id=word_id).first()

        if status == 'known':
            if wrong_word:
                db.session.delete(wrong_word)
        elif status == 'forgot':
            if wrong_word:
                wrong_word.wrong_count += 1
            else:
                wrong_word = WrongWord(user_id=user_id, word_id=word_id)
                db.session.add(wrong_word)
        # fuzzy: 保留错词不变

        # 创建学习记录
        today = date.today()
        record = StudyRecord.query.filter_by(
            user_id=user_id, word_id=word_id, study_time=today
        ).first()

        if record:
            record.status = status
        else:
            record = StudyRecord(
                user_id=user_id, word_id=word_id,
                status=status, study_time=today,
            )
            db.session.add(record)

        db.session.commit()

        # 更新后统计
        remaining = WrongWord.query.filter_by(user_id=user_id).count()

        return {
            'word_id': word_id,
            'status': status,
            'removed': status == 'known',
            'remaining_wrong': remaining,
        }, None
