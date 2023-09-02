var worker = new Worker("static/js/worker.js");
const outputElement = document.getElementById("ffmpeg-output");
const statusElement = document.getElementById("ffmpeg-status");
worker.onmessage = function (event) {
  var message = event.data;
  if (message.type == "ready") {
    outputElement.textContent = "Loaded";
    worker.postMessage({
      type: 'command',
      arguments: ['-help']
    })
  } else if (message.type == "stdout") {
    outputElement.textContent += message.data + "\n";
  } else if (message.type == "start") {
    outputElement.textContent = "Worker has received command\n";
    statusElement.textContent = "ffmpeg online";
  }
};

async function convert(file) {
}

function getsize(file){
    const sizeInBytes = file.size;
    
    const sizeInKB = sizeInBytes / 1024;

    const sizeInMB = sizeInKB / 1024;
    
    if (sizeInMB > 1) {
        console.log(`File size: ${sizeInMB.toFixed(2)} MB`);
    } else {
        console.log(`File size: ${sizeInKB.toFixed(2)} KB`);
    }
}

async function upload(){
    const fileInput = document.getElementById("audio");
    const file = fileInput.files[0];

    if (file) {
        // Create a FormData object and append the file
        const formData = new FormData();
        await formData.append("file", convert(file));
        getsize(file);

        // Send the file using a fetch POST request
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            message(result);
        })
        .catch(error => {
            message("Error uploading file:" + error);
        });
    } else {
        message("No file selected.");
    }
}

function message(msg){
    const item = document.getElementById("warning");
    item.textContent = msg;
}

function listing(){
    fetch("/list-files", {
        method: "POST",
    })
    .then(response => response.text())
    .then(result => {
        message(result);
    })
    .catch(error => {
        message("Error listing files:" + error);
    });
}

function encodeUrl(url){
    return url.replace(/ /g, '%20');
}

async function query(){
    const outputElement = document.getElementById("database-output");
    const query = document.getElementById("query").value;
    const type = document.getElementById("query-type").value;
    const encodedQuery = encodeUrl(query);
    const url = `/query?query=${encodedQuery}&type=${type}`;
    try {
        const response = await fetch(url);
        const jsonResponse = await response.json();

        outputElement.textContent = JSON.stringify(jsonResponse);
    } catch (error) {
        // Handle error, e.g., network issue or invalid JSON response
        console.log(error)
        message(error);
        return { error: "An error occurred" };
    }
}