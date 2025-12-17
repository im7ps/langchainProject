from app.core.client import client

def generate_ai_reply(message: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.5-flash-tts",
        contents=message
    )
    return response.text