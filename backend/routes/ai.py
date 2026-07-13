from flask import Blueprint, request, jsonify, g
from utils.decorators import login_required
from services.ai_service import AIService

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/example', methods=['POST'])
@login_required
def generate_example():
    """
    AI生成例句
    POST /api/v1/ai/example
    Body: { "word": "abandon", "meaning": "放弃" }
    """
    data = request.get_json(silent=True)
    if not data or not data.get('word'):
        return jsonify({'code': 1000, 'message': '请提供单词'}), 400

    word = data['word'].strip()
    meaning = data.get('meaning', '').strip()

    try:
        result = AIService.generate_example(g.current_user.id, word, meaning)
        return jsonify({'code': 0, 'message': 'ok', 'data': result}), 200
    except RuntimeError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500
    except ValueError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500


@ai_bp.route('/memory', methods=['POST'])
@login_required
def generate_memory():
    """
    AI生成记忆方法
    POST /api/v1/ai/memory
    Body: { "word": "beautiful", "meaning": "美丽的" }
    """
    data = request.get_json(silent=True)
    if not data or not data.get('word'):
        return jsonify({'code': 1000, 'message': '请提供单词'}), 400

    word = data['word'].strip()
    meaning = data.get('meaning', '').strip()

    try:
        result = AIService.generate_memory(g.current_user.id, word, meaning)
        return jsonify({'code': 0, 'message': 'ok', 'data': result}), 200
    except RuntimeError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500
    except ValueError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500


@ai_bp.route('/analyze', methods=['POST'])
@login_required
def generate_analysis():
    """
    AI学习分析 — 基于用户学习记录
    POST /api/v1/ai/analyze
    """
    from datetime import date, timedelta
    from models.study_record import StudyRecord
    from extensions import db

    # 收集用户近7天学习数据
    today = date.today()
    week_ago = today - timedelta(days=7)

    records = StudyRecord.query.filter(
        StudyRecord.user_id == g.current_user.id,
        StudyRecord.study_time >= week_ago,
    ).all()

    known_count = sum(1 for r in records if r.status == 'known')
    forgot_count = sum(1 for r in records if r.status == 'forgot')
    total_learned = len(set(r.word_id for r in records))

    # 薄弱单词（今天标注为forgot的）
    forgot_today = StudyRecord.query.filter(
        StudyRecord.user_id == g.current_user.id,
        StudyRecord.status == 'forgot',
        StudyRecord.study_time == today,
    ).all()
    weak_words = [r.word.word for r in forgot_today if r.word][:5]

    stats = {
        'total_learned': total_learned,
        'known_count': known_count,
        'forgot_count': forgot_count,
        'weak_words': weak_words,
    }

    try:
        result = AIService.generate_analysis(g.current_user.id, stats)
        return jsonify({'code': 0, 'message': 'ok', 'data': result}), 200
    except RuntimeError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500
    except ValueError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500


@ai_bp.route('/review-analysis', methods=['POST'])
@login_required
def review_analysis():
    """
    AI错词复习分析
    POST /api/v1/ai/review-analysis
    Body: { "known": 3, "forgot": 1, "fuzzy": 2, "total": 6, ... }
    服务端根据用户实际错词数据补充 high_priority_words 和 most_wrong_words
    """
    from models.wrong_word import WrongWord
    from models.word import Word

    body = request.get_json(silent=True) or {}
    user_id = g.current_user.id

    # 从数据库获取高优先级错词和错误最多的词
    wrong_items = WrongWord.query.filter_by(user_id=user_id).order_by(WrongWord.wrong_count.desc()).all()

    high_priority = [w.word.word for w in wrong_items if w.word and w.wrong_count >= 2][:5]
    most_wrong = [w.word.word for w in wrong_items if w.word][:5]

    review_data = {
        'total': body.get('total', 0),
        'known': body.get('known', 0),
        'forgot': body.get('forgot', 0),
        'fuzzy': body.get('fuzzy', 0),
        'high_priority_words': high_priority,
        'most_wrong_words': most_wrong,
    }

    try:
        result = AIService.generate_review_analysis(user_id, review_data)
        return jsonify({'code': 0, 'message': 'ok', 'data': result}), 200
    except RuntimeError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500
    except ValueError as e:
        return jsonify({'code': 2001, 'message': str(e)}), 500
