# backend/app.py

from flask import Flask
from flask_cors import CORS
from instance.config import Config   # <-- Import the config class

def create_app():
    """
    Application factory function.
    Creates and configures the Flask app instance.
    """

    # Create Flask app
    app = Flask(__name__)

    # Load config from Config class
    app.config.from_object(Config)

    # Enable CORS for frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000"]}},
    )

    # Register blueprints
    from src.controllers.refine_controller import refine_bp
    from src.controllers.download_controller import download_bp

    app.register_blueprint(refine_bp, url_prefix="/api")
    app.register_blueprint(download_bp, url_prefix="/api")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
