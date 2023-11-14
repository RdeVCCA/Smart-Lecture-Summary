from flask import Flask, render_template, request, send_from_directory
import requests
import tempfile
import os
import subprocess  # import subprocess for FFmpeg
import database
import json

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
gpt = os.environ.get('CHAT_GPT')
if gpt:
    keys = {"chatgpt":gpt}
else:
    keys = {"chatgpt":os.getenv('CHAT_GPT')}

def convert_video_to_audio(video_path, audio_path):
    command = ['ffmpeg', '-i', video_path, '-q:a', '0', '-map', 'a', audio_path, '-y']
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

@app.route('/static/js/<filename>')
def serve_js(filename):
    return send_from_directory('static/js', filename, mimetype='text/javascript')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400

    temp_dir = tempfile.mkdtemp()
    video_path = os.path.join(temp_dir, file.filename)
    file.save(video_path)

    audio_path = os.path.join(temp_dir, os.path.splitext(file.filename)[0] + '.mp3')
    convert_video_to_audio(video_path, audio_path)

    # Handle the audio file as needed

    os.remove(video_path)
    os.remove(audio_path)
    os.rmdir(temp_dir)

    return "Audio conversion successful"

@app.route('/query')
def proxy_query():
    query = request.args.get('query')
    type = request.args.get('type')
    result = database.query(query, type)
    print(result)
    return json.dumps(result)

@app.route("/")
def hello_world():
    return render_template('testing_template.html',
                           key_status=(lambda x: "Chat-GPT API key is valid" if x else "Chat-GPT API key is not valid")(is_api_key_valid(keys["chatgpt"])),
                           db_status=(lambda x: "Database Online" if x=="success" else "Database Offline")(database.query("", "test")["status"]),
                           test_query=database.query("", "test")["content"]
                           )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8888, debug=True)