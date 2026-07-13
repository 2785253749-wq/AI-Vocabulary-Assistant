from flask import Blueprint, request, jsonify, g
from utils.decorators import login_required
from services.word_service import WrongWordService

wrong_bp = Blueprint('wrong', __name__)


@wrong_bp.route('/list', methods=['GET'])
@login_required
def get_wrong_list():
    """GET /api/v1/wrong/list"""
    items = WrongWordService.get_wrong_list(g.current_user.id)
    return jsonify({'code': 0, 'message': 'ok', 'data': {'total': len(items), 'items': items}}), 200


@wrong_bp.route('/review', methods=['GET'])
@login_required
def get_review_words():
    """GET /api/v1/wrong/review — 获取错词复习列表"""
    data = WrongWordService.get_review_words(g.current_user.id)
    return jsonify({'code': 0, 'message': 'ok', 'data': data}), 200


@wrong_bp.route('/review', methods=['POST'])
@login_required
def submit_review():
    """POST /api/v1/wrong/review — 提交复习结果"""
    body = request.get_json(silent=True)
    if not body or not body.get('word_id') or not body.get('status'):
        return jsonify({'code': 1000, 'message': '请提供word_id和status'}), 400

    word_id = body['word_id']
    status = body['status']

    result, error = WrongWordService.submit_review(g.current_user.id, word_id, status)
    if error:
        return jsonify({'code': 1000, 'message': error}), 400

    return jsonify({'code': 0, 'message': 'ok', 'data': result}), 200


@wrong_bp.route('/<int:wrong_id>', methods=['DELETE'])
@login_required
def delete_wrong(wrong_id):
    """DELETE /api/v1/wrong/<id>"""
    success, error = WrongWordService.delete_wrong(wrong_id, g.current_user.id)
    if not success:
        return jsonify({'code': 1003, 'message': error}), 404
    return jsonify({'code': 0, 'message': '已移除'}), 200
