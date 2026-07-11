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
