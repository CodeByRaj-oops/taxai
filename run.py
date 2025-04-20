"""
Application entry point
"""
from app import create_app

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(app.config.get('PORT', 3001)),
        debug=app.config.get('FLASK_ENV') == 'development'
    ) 