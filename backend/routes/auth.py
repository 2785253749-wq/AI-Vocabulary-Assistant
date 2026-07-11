from flask import Blueprint, request, jsonify, g
from services.auth_service import AuthService
from utils.decorators import login_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    用户注册
    POST /api/v1/auth/register
    Body: { username, email, password }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'code': 1000, 'message': '请提供注册信息'}), 400

    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')

    user_data, error = AuthService.register(username, email, password)

    if error:
        return jsonify({'code': 1000, 'message': error}), 400

    return jsonify({
        'code': 0,
        'message': '注册成功',
        'data': user_data,
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    用户登录
    POST /api/v1/auth/login
    Body: { username, password }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'code': 1000, 'message': '请提供登录信息'}), 400

    username = data.get('username', '')
    password = data.get('password', '')

    auth_data, error = AuthService.login(username, password)

    if error:
        return jsonify({'code': 1000, 'message': error}), 401

    return jsonify({
        'code': 0,
        'message': '登录成功',
        'data': auth_data,
    }), 200


@auth_bp.route('/me', methods=['GET'])
@login_required
def get_me():
    """
    获取当前登录用户信息
    GET /api/v1/auth/me
    """
    return jsonify({
        'code': 0,
        'message': 'ok',
        'data': g.current_user.to_dict(),
    }), 200
