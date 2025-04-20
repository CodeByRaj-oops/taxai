"""
API routes and endpoint definitions
"""
import logging
from flask import Blueprint, request, jsonify, current_app
from pydantic import ValidationError

from app.schemas import ChatRequest
from app.openai_client import OpenAIClient
from app.utils import prepare_tax_context, create_response
from app import limiter

# Create Blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Set up logger
logger = logging.getLogger(__name__)

@api_bp.route('/chat', methods=['POST'])
@limiter.limit("20 per minute")
def chat():
    """
    Chat endpoint for tax consultation
    ---
    Processes user messages and generates AI responses with tax context
    """
    try:
        # Validate request body
        try:
            data = request.get_json()
            if not data:
                raise ValidationError("Missing request body", ChatRequest)
                
            chat_request = ChatRequest(**data)
        except ValidationError as e:
            logger.warning(f"Validation error: {str(e)}")
            return jsonify(create_response(
                error=f"Invalid request: {str(e)}",
                status="error"
            )), 400
            
        # Extract validated data
        message = chat_request.message
        tax_data = chat_request.taxData.dict() if chat_request.taxData else None
        
        # Log incoming request
        logger.info(f"Processing chat request with message: {message[:50]}...")
        
        # Prepare context for OpenAI
        context = prepare_tax_context(message, tax_data)
        
        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": "You are TaxAI, an expert in Indian tax law."},
            {"role": "user", "content": context}
        ]
        
        # Get completion from OpenAI
        try:
            reply = OpenAIClient.get_completion(messages)
            
            # Return successful response
            return jsonify(create_response(
                data={"reply": reply}
            ))
            
        except Exception as e:
            logger.error(f"Error getting OpenAI completion: {str(e)}")
            return jsonify(create_response(
                error="Failed to generate tax analysis. Please try again later.",
                status="error"
            )), 500
            
    except Exception as e:
        # Catch any unexpected errors
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        return jsonify(create_response(
            error="An unexpected error occurred",
            status="error"
        )), 500

# Add more routes as needed 