import jwt
from datetime import datetime, timedelta
from flask import current_app


def create_access_token(user_id: int) -> str:
    """生成JWT访问令牌"""
    payload = {
        'user_id': user_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', 1)),
        'type': 'access',
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def verify_access_token(token: str) -> dict | None:
    """验证JWT令牌，成功返回payload，失败返回None"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256'],
            options={'require': ['exp', 'user_id']}
        )
        if payload.get('type') != 'access':
            return None
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
