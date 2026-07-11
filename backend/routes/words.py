from flask import Blueprint, request, jsonify, g
from utils.decorators import login_required
from services.word_service import WordService

words_bp = Blueprint('words', __name__)


@words_bp.route('/today', methods=['GET'])
@login_required
def get_today_words():
    """
    获取今日学习单词
    GET /api/v1/words/today?count=10
    """
    count = request.args.get('count', 10, type=int)
    count = max(1, min(count, 50))  # 限制 1~50

    words = WordService.get_today_words(g.current_user.id, count)

    return jsonify({
        'code': 0,
        'message': 'ok',
        'data': {
            'date': str(__import__('datetime').date.today()),
            'total': len(words),
            'words': words,
        },
    }), 200


@words_bp.route('/<int:word_id>', methods=['GET'])
@login_required
def get_word_detail(word_id):
    """
    获取单词详情
    GET /api/v1/words/<id>
    """
    word = WordService.get_word_detail(word_id)

    if not word:
        return jsonify({'code': 1003, 'message': '单词不存在'}), 404

    return jsonify({
        'code': 0,
        'message': 'ok',
        'data': word,
    }), 200
