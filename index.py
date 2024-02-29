from flask import Flask, render_template, request, send_from_directory
import requests
import tempfile
import os
import subprocess  # import subprocess for FFmpeg
import json
from openai import OpenAI

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

client = OpenAI(api_key=keys["chatgpt"])

def convert_video_to_audio(video_path, audio_path):
    command = ['ffmpeg', '-i', video_path, '-q:a', '0', '-map', 'a', audio_path, '-y']
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def compress_file(input_file_path, output_file_path):
    target_size_mb = 25
    target_size_bytes = target_size_mb * 1024 * 1024  # Convert MB to bytes

    # Run ffmpeg to compress the file
    subprocess.run(['ffmpeg', '-i', input_file_path, '-fs', str(target_size_bytes), output_file_path])

def speech_to_text(filename,dir):
    result = ""
    with open(filename, 'rb') as f:
        transcription = client.audio.transcriptions.create(
        model="whisper-1", 
        file=f,
        # language="en"
        )
        result = transcription.text
    
    os.remove(filename)
    os.rmdir(dir)
    return result

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
    audio_path = os.path.join(temp_dir, os.path.splitext(file.filename)[0] + ".webm")
    file.save(audio_path)
    compressed_path = os.path.join(temp_dir, "compressed.webm")
    try:
        print(audio_path,compressed_path)
        compress_file(audio_path, compressed_path)
        
    except:
        os.remove(compressed_path)
        os.remove(audio_path)
        os.rmdir(temp_dir)

    os.remove(audio_path)
    print("Audio conversion successful at " + compressed_path + " ")
    text_result = speech_to_text(compressed_path,temp_dir)
    return "\nTranscription: " + text_result

# @app.route('/query')
# def proxy_query():
#     query = request.args.get('query')
#     type = request.args.get('type')
#     result = database.query(query, type)
#     print(result)
#     return json.dumps(result)

@app.route("/")
def hello_world():
    return render_template('testing_template.html', key_status=(lambda x: "Chat-GPT API key is valid" if x else "Chat-GPT API key is not valid")(is_api_key_valid(keys["chatgpt"])),
                           )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9999, debug=True)