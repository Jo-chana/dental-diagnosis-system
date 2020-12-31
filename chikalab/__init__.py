import os
from flask import Flask

instance_dir = None
static_dir = None


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        # DATABASE=os.path.join(app.instance_path, 'chikalab.sqlite'),
    )
    global instance_dir, static_dir
    instance_dir = app.instance_path
    static_dir = os.path.join(app.root_path, 'static', 'images')

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import main
    app.register_blueprint(main.bp)
    app.add_url_rule('/', endpoint='index')

    @app.route('/demo')
    def demo():
        return 'Demo Page'

    return app
