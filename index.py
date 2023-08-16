from flask import Flask, render_template, request
import requests
import tempfile
import os

def is_api_key_valid(api_key: str) -> bool:
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
gpt = os.environ.get('CHAT_GPT') or ""
keys = {"chatgpt": gpt}

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400

    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, file.filename)
    file.save(file_path)
    listing = str(os.listdir(temp_dir))

    os.remove(file_path)
    os.rmdir(temp_dir)

    return "File saved to: " + os.path.abspath(os.path.join(file_path, file.filename)) + "\n" + listing

@app.route("/")
def hello_world():
    return render_template('testing_template.html', key_status=(lambda x: "Chat-GPT API key is valid" if x else "Chat-GPT API key is not valid")(is_api_key_valid(keys["chatgpt"])))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8888, debug=True)
