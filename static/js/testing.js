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
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const videoData = new Uint8Array(event.target.result);

            // sends data to the worker with FFmpeg commands
            postToWorker(videoData, file.name, resolve, reject);
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

function postToWorker(videoData, filename, resolve, reject) {
    // Sending a command to convert video to audio (e.g., mp4 to mp3)
    worker.postMessage({
        type: 'command',
        arguments: ['-i', filename, '-vn', '-ar', '44100', '-ac', '2', '-ab', '192k', '-f', 'mp3', 'output.mp3'],
        files: [{name: filename, data: videoData}]
    });

    // Handle messages from the worker
    worker.onmessage = function (event) {
        var message = event.data;

        if (message.type === "done") {
            // The conversion is complete
            const audioData = message.data[0].data; // This is your audio file data
            resolve(new Blob([audioData], {type: 'audio/mp3'}));
        } else if (message.type === "error") {
            reject(message.data);
        }
    };
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

// async function upload() {
//     // const fileInput = document.getElementById("audio");
//     const fileInput = document.getElementById("audio-upload");
//     const file = fileInput.files[0];

//     if (file) {
//         try {
//             const audioBlob = await convert(file);

//             const formData = new FormData();
//             formData.append("file", audioBlob, "output.mp3");

//             fetch("/upload", {
//                 method: "POST",
//                 body: formData
//             })
//             .then(response => response.text())
//             .then(result => {
//                 message(result);
//             })
//             .catch(error => {
//                 message("Error uploading file:" + error);
//             });
//         } catch (error) {
//             message("Error converting file:" + error);
//         }
//     } else {
//         message("No file selected.");
//     }
// }

// function message(msg){
//     const item = document.getElementById("warning");
//     item.textContent = msg;
// }

async function upload() {
    const fileInput = document.getElementById("audio-upload");
    const file = fileInput.files[0];
    const fileNameDisplay = document.getElementById("file-name");

    if (file) {
        // display file name next to upload button
        fileNameDisplay.textContent = file.name;

        try {
            const audioBlob = await convert(file);

            const formData = new FormData();
            formData.append("file", audioBlob, "output.mp3");

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
        } catch (error) {
            message("Error converting file:" + error);
        }
    } else {
        fileNameDisplay.textContent = "";
        message("No file selected.");
    }
}

function message(msg){
    const item = document.getElementById("warning");
    if(item) {
        item.textContent = msg;
    }
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

// debugging
console.log(outputElement); // Check if this is null
console.log(statusElement); // Check if this is null
console.log(fileInput); // Check if this is null
