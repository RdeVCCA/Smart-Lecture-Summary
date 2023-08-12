from flask import Flask, render_template
import requests
import os

def is_api_key_valid(api_key):
    url = "https://api.openai.com/v1/engines/davinci/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "prompt": "Test API key",
        "max_tokens": 1
    }

    response = requests.post(url, headers=headers, json=data)
    return response.status_code == 200

app = Flask(__name__)
gpt = os.environ.get('CHAT_GPT')
if gpt:
    keys = {"chatgpt":gpt}
else:
    keys = {"chatgpt":os.getenv('CHAT_GPT')}

@app.route("/")
def hello_world():
    return render_template('testing_template.html', key_status=(lambda x: "Chat-GPT API key is valid" if x else "Chat-GPT API key is not valid")(is_api_key_valid(keys["chatgpt"])))

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8888,debug=True)