from datetime import date, timedelta
from collections import defaultdict
from flask import Blueprint, jsonify, g
from utils.decorators import login_required
from models.study_record import StudyRecord
from models.wrong_word import WrongWord
from extensions import db

stats_bp = Blueprint('statistics', __name__)


@stats_bp.route('', methods=['GET'])
@login_required
def get_statistics():
    """
    获取用户学习统计
    GET /api/v1/statistics
    """
    user_id = g.current_user.id
    today = date.today()
    week_ago = today - timedelta(days=6)

    # 1. 累计学习单词数量（有学习记录的唯一单词数）
    total_words = db.session.query(StudyRecord.word_id).filter(
        StudyRecord.user_id == user_id,
    ).distinct().count()

    # 2. 认识数量（status=known 的唯一单词数）
    known_words = db.session.query(StudyRecord.word_id).filter(
        StudyRecord.user_id == user_id,
        StudyRecord.status == 'known',
    ).distinct().count()

    # 3. 忘记数量（当前错词本中的单词数）
    forgot_words = WrongWord.query.filter_by(user_id=user_id).count()

    # 4. 今日学习数量
    today_count = db.session.query(StudyRecord.word_id).filter(
        StudyRecord.user_id == user_id,
        StudyRecord.study_time == today,
    ).distinct().count()

    # 5. 最近7天学习趋势（每天的学习单词数 + known/forgot 分布）
    records = StudyRecord.query.filter(
        StudyRecord.user_id == user_id,
        StudyRecord.study_time >= week_ago,
        StudyRecord.study_time <= today,
    ).all()

    # 按日期分组统计
    daily_data = defaultdict(lambda: {'count': 0, 'known': 0, 'forgot': 0})
    for r in records:
        day_str = r.study_time.isoformat()
        daily_data[day_str]['count'] += 1
        if r.status == 'known':
            daily_data[day_str]['known'] += 1
        elif r.status == 'forgot':
            daily_data[day_str]['forgot'] += 1

    # 填充7天完整数据
    week_data = []
    for i in range(7):
        d = week_ago + timedelta(days=i)
        day_str = d.isoformat()
        info = daily_data.get(day_str, {'count': 0, 'known': 0, 'forgot': 0})
        week_data.append({
            'date': day_str,
            'count': info['count'],
            'known': info['known'],
            'forgot': info['forgot'],
        })

    # 6. 学习天数（有学习记录的不同日期数）
    study_days = db.session.query(StudyRecord.study_time).filter(
        StudyRecord.user_id == user_id,
    ).distinct().count()

    return jsonify({
        'code': 0,
        'message': 'ok',
        'data': {
            'total_words': total_words,
            'known_words': known_words,
            'forgot_words': forgot_words,
            'today_count': today_count,
            'study_days': study_days,
            'week_data': week_data,
        },
    }), 200
