# Tax AI Chat Application

A Flask-based API that integrates with OpenAI to provide tax-related advice and analysis for Indian tax regimes.

## Features

- OpenAI integration for tax consultation
- Input validation using Pydantic
- Rate limiting to prevent abuse
- Detailed logging
- Standardized error handling
- Environment-based configuration

## Project Structure

```
tax-ai-chat/
├── app/
│   ├── __init__.py        # Application factory and configuration
│   ├── routes.py          # API endpoint definitions
│   ├── openai_client.py   # OpenAI API integration
│   ├── utils.py           # Helper functions
│   └── schemas.py         # Pydantic validation schemas
├── .env                   # Environment variables (not committed to version control)
├── requirements.txt       # Project dependencies
├── run.py                 # Application entry point
└── README.md              # Project documentation
```

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tax-ai-chat.git
   cd tax-ai-chat
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create `.env` file with your configuration:
   ```
   cp .env.example .env
   # Edit .env with your OpenAI API key and other settings
   ```

5. Run the application:
   ```
   python run.py
   ```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the status of the API.

### Chat
```
POST /api/chat
```
Send a tax-related question and optionally include tax calculation data for context.

#### Request Body
```json
{
  "message": "Should I choose the old or new tax regime?",
  "taxData": {
    "taxInputs": {
      "basicSalary": 1000000,
      "hra": 500000,
      "specialAllowance": 200000,
      "section80C": 150000,
      "section80D_self": 25000
    },
    "taxResults": {
      "oldRegime": {
        "taxAmount": 140000
      },
      "newRegime": {
        "taxAmount": 160000
      },
      "bestRegime": "old",
      "totalSavings": 20000
    }
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "reply": "Based on your financial situation, I recommend choosing the old tax regime..."
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| FLASK_APP | Flask application entry point | run.py |
| FLASK_ENV | Application environment | development |
| PORT | Server port | 3001 |
| SECRET_KEY | Secret key for Flask | your-secret-key-here |
| OPENAI_API_KEY | OpenAI API key | None |
| OPENAI_MODEL | OpenAI model to use | gpt-4 |
| MAX_TOKENS | Maximum tokens for OpenAI responses | 1000 |
| TEMPERATURE | Temperature setting for responses | 0.7 |

## Testing

Run tests with pytest:
```
pytest
```

## License

MIT 