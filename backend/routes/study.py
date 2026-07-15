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


@study_bp.route('/revise-result', methods=['PUT'])
@login_required
def revise_result():
    """
    修正学习结果（用户翻卡后发现记错了）
    PUT /api/v1/study/revise-result
    Body: { "word_id": 1, "old_status": "known", "new_status": "forgot" }
    """
    from datetime import date
    from models.study_record import StudyRecord
    from models.wrong_word import WrongWord
    from extensions import db

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'code': 1000, 'message': '请提供数据'}), 400

    word_id = data.get('word_id')
    old_status = data.get('old_status')
    new_status = data.get('new_status')

    if not word_id or not new_status:
        return jsonify({'code': 1000, 'message': '参数不完整'}), 400

    # 更新今日StudyRecord
    today = date.today()
    record = StudyRecord.query.filter_by(
        user_id=g.current_user.id, word_id=word_id, study_time=today
    ).first()

    if record:
        record.status = new_status

    # 处理 WrongWord: known→forgot 需要新增错词
    if new_status == 'forgot':
        wrong = WrongWord.query.filter_by(user_id=g.current_user.id, word_id=word_id).first()
        if wrong:
            wrong.wrong_count += 1
        else:
            db.session.add(WrongWord(user_id=g.current_user.id, word_id=word_id))
    elif new_status == 'known':
        # forgot→known 需要移除错词
        wrong = WrongWord.query.filter_by(user_id=g.current_user.id, word_id=word_id).first()
        if wrong:
            db.session.delete(wrong)

    db.session.commit()

    remaining = WrongWord.query.filter_by(user_id=g.current_user.id).count()

    return jsonify({
        'code': 0,
        'message': '已修正',
        'data': {
            'word_id': word_id,
            'old_status': old_status,
            'new_status': new_status,
            'is_wrong_word': new_status == 'forgot',
            'remaining_wrong': remaining,
        },
    }), 200
