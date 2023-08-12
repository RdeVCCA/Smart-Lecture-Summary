from flask import Flask, render_template
import os

app = Flask(__name__)
gpt = os.environ.get('CHAT_GPT')
if gpt:
    keys = {"chatgpt":gpt}
else:
    keys = {"chatgpt":os.getenv('CHAT_GPT')}

@app.route("/")
def hello_world():
    return render_template('testing_template.html', key_status=(lambda x: "Chat-GPT Key Found" if x else "Chat-GPT Key Not Found")(keys["chatgpt"]))

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8888,debug=True)