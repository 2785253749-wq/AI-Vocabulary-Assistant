from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from extensions import db
from utils.jwt import create_access_token


class AuthService:
    """用户认证服务"""

    @staticmethod
    def register(username: str, email: str, password: str) -> tuple[dict | None, str | None]:
        """
        用户注册
        返回: (user_dict, error_message)
        """
        # 参数校验
        if not username or len(username.strip()) < 2:
            return None, '用户名至少2个字符'
        if not email or '@' not in email:
            return None, '邮箱格式不正确'
        if not password or len(password) < 6:
            return None, '密码至少6个字符'

        username = username.strip()
        email = email.strip().lower()

        # 检查用户名是否已存在
        if User.query.filter_by(username=username).first():
            return None, '用户名已被注册'

        # 检查邮箱是否已存在
        if User.query.filter_by(email=email).first():
            return None, '邮箱已被注册'

        # 创建用户
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
        )
        db.session.add(user)
        db.session.commit()

        return user.to_dict(), None

    @staticmethod
    def login(username: str, password: str) -> tuple[dict | None, str | None]:
        """
        用户登录
        返回: (auth_data_dict, error_message)
        """
        if not username or not password:
            return None, '用户名和密码不能为空'

        # 查找用户
        user = User.query.filter_by(username=username.strip()).first()
        if user is None:
            return None, '用户名或密码错误'

        # 验证密码
        if not check_password_hash(user.password_hash, password):
            return None, '用户名或密码错误'

        # 生成JWT
        token = create_access_token(user.id)

        return {
            'access_token': token,
            'user': user.to_dict(),
        }, None

    @staticmethod
    def get_user_by_id(user_id: int) -> dict | None:
        """根据ID获取用户信息"""
        user = User.query.get(user_id)
        return user.to_dict() if user else None
