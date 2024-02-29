import requests
import os

def is_api_key_valid(api_key: str) -> bool:
    url = "https://api.openai.com/v1/engines/davinci-codex/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "prompt": "Test API key",
        "max_tokens": 1
    }

    response = requests.post(url, headers=headers, json=data)
    print(response)
    return response.status_code == 200

print(is_api_key_valid(os.getenv('CHAT_GPT')))