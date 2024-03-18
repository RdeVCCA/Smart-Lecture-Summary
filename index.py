from flask import Flask, render_template, request, send_from_directory
import requests
import tempfile
import os
import re
from datetime import datetime
import subprocess  # import subprocess for FFmpeg
import json
from openai import OpenAI
import nltk

# Download the punkt tokenizer for sentence splitting
nltk.download('punkt')

app = Flask(__name__)
gpt = os.environ.get('CHAT_GPT')

if gpt:
    keys = {"chatgpt":gpt}
else:
    keys = {"chatgpt":os.getenv('CHAT_GPT')}

client = OpenAI(api_key=keys["chatgpt"])

def is_api_key_valid(api_key: str) -> bool:
    url = "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions"
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

def save_result(result, filename, subfix):
    # result is all text, save in .md
    with open(filename+"." + subfix, "w") as file:
        file.write(result)
    
def convert_video_to_audio(video_path, audio_path):
    command = ['ffmpeg', '-i', video_path, '-q:a', '0', '-map', 'a', audio_path, '-y']
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# file renaming function
def rename_file(original_file):
    current_datetime = datetime.now()
    date_stamp = current_datetime.strftime('%d%m%Y-%H%M')
    file_name, file_extension = os.path.splitext(original_file)
    new_file_name = f"{file_name}-{date_stamp}{file_extension}"
    os.rename(original_file, new_file_name)

# time elapsed since file rename function
def calculate_time_since(filename):
    datetime_part = re.search(r'-(\d{8}-\d{4})\.', filename)
    if datetime_part:
        datetime_str = datetime_part.group(1)
    else:
        print("datetime format in the filename is not recognized.")
        return
    file_datetime = datetime.strptime(datetime_str, '%d%m%Y-%H%M')
    current_datetime = datetime.now()
    time_difference = current_datetime - file_datetime
    return time_difference

# delete empty folders
def delete_empty_folders(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        for name in dirs:
            dir_path = os.path.join(root, name)
            if not os.listdir(dir_path):
                os.rmdir(dir_path)

@app.route('/static/js/<filename>')
def serve_js(filename):
    return send_from_directory('static/js', filename, mimetype='text/javascript')

@app.route('/video', methods=['POST'])
def video():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400
    return "Video received"

@app.route('/audio', methods=['POST'])
def audio():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400
    
    temp_dir = tempfile.mkdtemp()
    audio_path = os.path.join(temp_dir, os.path.splitext(file.filename)[0] + ".webm")
    file.save(audio_path)

    return {"filepath": audio_path, "folder": temp_dir, "status": 200}

@app.route("/compression", methods=['POST'])
def compression():
    def compress_file(input_file_path, output_file_path):
        target_size_mb = 25
        target_size_bytes = target_size_mb * 1024 * 1024  # Convert MB to bytes
        subprocess.run(['ffmpeg', '-i', input_file_path, '-fs', str(target_size_bytes), output_file_path])
    print("Compressing audio...")
    temp_dir = request.json["folder"]
    file_path = request.json["filepath"]

    compressed_path = file_path.split(".")[0] + "-compressed.webm"
    compress_file(file_path, compressed_path)
    os.remove(file_path)
    
    print("Audio conversion successful at " + compressed_path + " ")
    return {"filepath": compressed_path, "folder": temp_dir, "status": 200}

@app.route('/transcribe', methods=['POST'])
def transcribe():
    def speech_to_text(filename):
        result = ""
        with open(filename, 'rb') as f:
            transcription = client.audio.transcriptions.create(
            model="whisper-1", 
            file=f,
            language="en"
            )
            result = transcription.text

        return result

    temp_dir = request.json["folder"]
    compressed_path = request.json["filepath"]

    print("Transcribing audio...")
    text_result = speech_to_text(compressed_path)
    print("Transcription successful")
    os.remove(compressed_path)
    save_result(text_result, os.path.join(temp_dir,"transcription"), "txt")
    return {"transcription": text_result, "transcription_path": os.path.join(temp_dir,"transcription.txt"), "folder":temp_dir, "status": 200}

@app.route('/summary', methods=['POST'])
def summary():
    def get_summary(lecture_content):
        prompt = "Can you summarize the main ideas of this lecture, paragraph it and highlight important points, express it in .md format: " + lecture_content

        tokens = nltk.word_tokenize(prompt)
        print(f"total length of tokens in lecture: {len(tokens)}")

        if len(tokens) > 3048: #splitting up the lecture length into different length and summarise it separately
            prompt_lst = []
            if len(tokens) % 3048 != 0:
                times = len(tokens) // 3048 + 1
            else:
                times = len(tokens) / 3048
            start = 0
            end = 3048
            for i in range(times):
                if i + 1 != times:
                    prompt_lst.append(prompt[start: end])
                    start += 3048
                    end += 3048
                else:
                    prompt_lst.append(prompt[start:len(tokens)])
            print(f"Number of sets of prompts: {len(prompt_lst)}")
            for i in range(times):
                print(f"Length of prompt{i}: {len(prompt_lst[i])}")
            
            summary = ''
            for i in range(0, times):
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a professional essay writer and is good at summarising lectures."},
                        {"role": "user", "content": prompt_lst[i]}
                    ],
                )
                summary += response.choices[0].message.content.strip()
                summary += "HERE IS THE BREAK"
            return summary
        else:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional essay writer and is good at summarising lectures."},
                    {"role": "user", "content": prompt}
                ],
            )
            return response.choices[0].message.content.strip()
        
    text_result = request.json["transcription"]
    temp_dir = request.json["folder"]

    print("Creating summary...")
    summary = get_summary(text_result)
    print("Summary successful")

    save_result(summary, os.path.join(temp_dir,"summary"), "md")
    return {"summary": summary, "transcription_path": request.json["transcription_path"],"summary_path": os.path.join(temp_dir,"summary.md"), "status": 200}

@app.route('/download', methods=['POST'])

@app.route('/delete', methods=['POST'])

@app.route("/clean", methods=['POST'])

@app.route("/")
def render_main():
    return render_template('testing_template.html', key_status=(lambda x: "Chat-GPT API key is valid" if x else "Chat-GPT API key is not valid")(is_api_key_valid(keys["chatgpt"])),
                           )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9999, debug=True)