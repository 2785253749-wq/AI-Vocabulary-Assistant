from flask import Blueprint, request, jsonify, g
from utils.decorators import login_required
from services.word_service import StudyService

study_bp = Blueprint('study', __name__)


@study_bp.route('/record', methods=['POST'])
@login_required
def record_study():
    """
    提交学习结果
    POST /api/v1/study/record
    Body: { "word_id": 1, "status": "forgot" }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'code': 1000, 'message': '请提供学习数据'}), 400

    word_id = data.get('word_id')
    status = data.get('status', '')

    if not word_id or not status:
        return jsonify({'code': 1000, 'message': 'word_id和status不能为空'}), 400

    result, error = StudyService.record_study(g.current_user.id, word_id, status)

    if error:
        return jsonify({'code': 1000, 'message': error}), 400

    return jsonify({
        'code': 0,
        'message': '记录成功',
        'data': result,
    }), 200
