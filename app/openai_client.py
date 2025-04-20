"""
OpenAI client for handling API communication
"""
import logging
import openai
from flask import current_app

logger = logging.getLogger(__name__)

class OpenAIClient:
    """Client for interacting with OpenAI API"""
    
    @staticmethod
    def get_completion(messages):
        """
        Get completion from OpenAI API
        
        Args:
            messages (list): List of message objects with role and content
            
        Returns:
            str: Generated text from OpenAI
            
        Raises:
            Exception: If API call fails
        """
        try:
            # Configure OpenAI client with API key from app config
            openai.api_key = current_app.config['OPENAI_API_KEY']
            
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model=current_app.config['OPENAI_MODEL'],
                messages=messages,
                temperature=current_app.config['TEMPERATURE'],
                max_tokens=current_app.config['MAX_TOKENS']
            )
            
            # Log successful API call
            logger.info("Successfully received response from OpenAI API")
            
            # Return generated text
            return response.choices[0].message.content
            
        except openai.error.OpenAIError as e:
            # Log OpenAI-specific errors
            logger.error(f"OpenAI API error: {str(e)}")
            raise
            
        except Exception as e:
            # Log unexpected errors
            logger.error(f"Unexpected error calling OpenAI API: {str(e)}")
            raise 