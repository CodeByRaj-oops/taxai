"""
Tests for the Flask application
"""
import json
import pytest
from app import create_app
from unittest.mock import patch

@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    yield app

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "ok"
    assert data["message"] == "Server is running"

@patch('app.openai_client.OpenAIClient.get_completion')
def test_chat_endpoint_success(mock_get_completion, client):
    """Test chat endpoint with successful OpenAI response"""
    # Mock the OpenAI API response
    mock_get_completion.return_value = "This is a test response from the mocked OpenAI API."
    
    # Test data
    request_data = {
        "message": "Test message"
    }
    
    # Make API call
    response = client.post(
        "/api/chat",
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "success"
    assert "reply" in data["data"]
    assert data["data"]["reply"] == "This is a test response from the mocked OpenAI API."
    
    # Verify mock was called with correct arguments
    mock_get_completion.assert_called_once()
    args = mock_get_completion.call_args[0][0]
    assert len(args) == 2
    assert args[0]["role"] == "system"
    assert args[1]["role"] == "user"
    assert args[1]["content"] == "Test message"

def test_chat_endpoint_invalid_request(client):
    """Test chat endpoint with invalid request"""
    # Test with empty message
    request_data = {
        "message": ""
    }
    
    # Make API call
    response = client.post(
        "/api/chat",
        data=json.dumps(request_data),
        content_type='application/json'
    )
    
    # Check response
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["status"] == "error"
    assert "error" in data 