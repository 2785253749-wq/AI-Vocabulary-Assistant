from flask import Flask, jsonify
from config import get_config
from extensions import db, cors


def create_app(config_name=None):
    """
    应用工厂函数
    创建并配置Flask应用实例
    """
    app = Flask(__name__)

    # 加载配置
    if config_name is None:
        from config import get_config
        app.config.from_object(get_config())
    else:
        app.config.from_object(config_name)

    # 初始化扩展
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # 注册蓝图路由
    from routes import register_routes
    register_routes(app)

    # 健康检查接口
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'code': 0,
            'message': 'ok',
            'data': {
                'status': 'healthy',
                'version': '0.1.0'
            }
        })

    # 统一错误处理
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'code': 1003, 'message': '资源不存在'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'code': 2000, 'message': '服务器内部错误'}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        # 确保数据库表已创建（开发阶段使用，后续迁移到Flask-Migrate）
        db.create_all()
    app.run(debug=True, port=5000)
