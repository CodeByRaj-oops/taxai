"""
Initialize and configure the Flask application
"""
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Configure app
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key'),
        OPENAI_API_KEY=os.environ.get('OPENAI_API_KEY'),
        OPENAI_MODEL=os.environ.get('OPENAI_MODEL', 'gpt-4'),
        MAX_TOKENS=int(os.environ.get('MAX_TOKENS', 1000)),
        TEMPERATURE=float(os.environ.get('TEMPERATURE', 0.7))
    )
    
    # Initialize extensions
    CORS(app)
    limiter.init_app(app)
    
    # Register blueprints
    from app.routes import api_bp
    app.register_blueprint(api_bp)
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'message': 'Server is running'}
    
    # Log application startup
    logger.info(f"Flask app configured with OpenAI model: {app.config['OPENAI_MODEL']}")
    logger.info(f"OpenAI API Key is {'configured' if app.config['OPENAI_API_KEY'] else 'missing'}")
    
    return app 