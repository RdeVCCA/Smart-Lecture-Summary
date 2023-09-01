import requests
import json
import os

def encode_url(url):
    url = url.replace(" ", "%20")
    return url

def query(query,type):
    url = os.environ.get("db_url")
    query = encode_url(query)
    password = os.environ.get("db_password")
    url = url + "query=" + query + "&type=" + type + "&password=" + password
    r = requests.get(url)
    j = json.loads(r.text)
    result = {"payload":r.text,"status":j[0]}
    if result["status"] == "success":
        if type == "select" or type == "test":
            result["content"] = j[1:]
        else:
            result["content"] = []
    return result