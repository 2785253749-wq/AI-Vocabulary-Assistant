from functools import wraps
from flask import request, jsonify, g
from utils.jwt import verify_access_token
from models.user import User


def login_required(f):
    """登录验证装饰器 — 验证JWT并将当前用户注入g.user"""

    @wraps(f)
    def decorated(*args, **kwargs):
        # 从 Authorization header 获取 token
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'code': 1001, 'message': '未提供认证令牌'}), 401

        token = auth_header[7:]  # 去掉 "Bearer " 前缀
        payload = verify_access_token(token)

        if payload is None:
            return jsonify({'code': 1001, 'message': '认证令牌无效或已过期'}), 401

        # 查询用户是否仍然存在
        user = User.query.get(payload['user_id'])
        if user is None:
            return jsonify({'code': 1001, 'message': '用户不存在'}), 401

        g.current_user = user
        return f(*args, **kwargs)

    return decorated
