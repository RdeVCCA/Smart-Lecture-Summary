from flask import Flask, render_template, request
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

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400
    
    root_directory = os.path.abspath(os.getcwd())
    upload_directory = os.path.join(root_directory,'tmp')
    print(upload_directory)
    os.makedirs(upload_directory, exist_ok=True)
    file.save(os.path.join(upload_directory, file.filename))

    return "File saved to: " + os.path.abspath(os.path.join(upload_directory, file.filename)) + "\n" + str(os.listdir(upload_directory))

@app.route("/list-files", methods=["POST"])
def list_file():
    root_directory = os.path.abspath(os.getcwd())
    upload_directory = os.path.join(root_directory,'tmp')
    os.makedirs(upload_directory, exist_ok=True)
    return str(os.listdir(upload_directory))

@app.route("/")
def hello_world():
    return render_template('testing_template.html', key_status=(lambda x: "Chat-GPT API key is valid" if x else "Chat-GPT API key is not valid")(is_api_key_valid(keys["chatgpt"])))

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8888,debug=True)