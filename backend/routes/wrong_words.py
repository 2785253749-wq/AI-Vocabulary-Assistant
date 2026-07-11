from flask import Blueprint, jsonify, g
from utils.decorators import login_required
from services.word_service import WrongWordService

wrong_bp = Blueprint('wrong', __name__)


@wrong_bp.route('/list', methods=['GET'])
@login_required
def get_wrong_list():
    """
    获取错词本列表
    GET /api/v1/wrong/list
    """
    items = WrongWordService.get_wrong_list(g.current_user.id)

    return jsonify({
        'code': 0,
        'message': 'ok',
        'data': {
            'total': len(items),
            'items': items,
        },
    }), 200


@wrong_bp.route('/<int:wrong_id>', methods=['DELETE'])
@login_required
def delete_wrong(wrong_id):
    """
    删除错词记录
    DELETE /api/v1/wrong/<id>
    """
    success, error = WrongWordService.delete_wrong(wrong_id, g.current_user.id)

    if not success:
        return jsonify({'code': 1003, 'message': error}), 404

    return jsonify({'code': 0, 'message': '已移除'}), 200
