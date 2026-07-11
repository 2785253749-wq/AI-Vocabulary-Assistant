def register_routes(app):
    """注册所有Blueprint到Flask应用"""

    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    from routes.words import words_bp
    from routes.study import study_bp
    from routes.wrong_words import wrong_bp
    app.register_blueprint(words_bp, url_prefix='/api/v1/words')
    app.register_blueprint(study_bp, url_prefix='/api/v1/study')
    app.register_blueprint(wrong_bp, url_prefix='/api/v1/wrong')

    # Phase 4: AI路由
    from routes.ai import ai_bp
    app.register_blueprint(ai_bp, url_prefix='/api/v1/ai')

    # Phase 5: 统计
    # from routes.stats import stats_bp
    # app.register_blueprint(stats_bp, url_prefix='/api/v1/stats')
