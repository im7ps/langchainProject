from app.core.client import client

def generate_ai_reply(message: str) -> str:
    response = client.models.generate_content(
        model="gemma-3-12b-it",
        contents=message
    )
    return response.text