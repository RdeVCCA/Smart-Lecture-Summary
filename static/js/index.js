var worker = new Worker("static/js/worker.js");
const outputElement = document.getElementById("ffmpeg-output");
const statusElement = document.getElementById("ffmpeg-status");
const fileNameDisplay = document.getElementById("file-name");
const conversionStatus = document.getElementById("conversion-status");
let startTime;
let endTime;

var filename = "";

async function log(text,target="ffmpeg-output"){
    // const ele = document.getElementById("ffmpeg-output");
    if (target == "ffmpeg-output") {
        const ele = document.getElementById(target);
        ele.innerHTML += text + "<br>";
    }else{
        const ele = document.getElementById(target);
        ele.innerHTML = text;
        const ele2 = document.getElementById("ffmpeg-output");
        ele2.innerHTML += text + "<br>";
    }
    
}

function message(msg){
    const item = document.getElementById("warning");
    if(item) {
        item.textContent = msg;
    }
}

worker.onmessage = function (event) {
    var message = event.data;
    switch (message.type) {
      case "ready":
        statusElement.classList.add('green');
        showMain();
        break;
      case "stdout":
      case "stderr":
        outputElement.textContent += message.data + "\n";
        break;
      case "start":
        statusElement.textContent = "Processing...";
        outputElement.textContent = "";
        break;
      case "done":
        statusElement.textContent = "Processing completed";
        break;
    }
};


async function upload() {
    const fileInput = document.getElementById("audio");
    const file = fileInput.files[0];

    log("Converting file...", "status");
    // setProgress(5);
    // const fileNameDisplay = document.getElementById("file-name");
    if (file) {
        // display file name next to upload button
        log(file.name);
        startLoading(file);
        try {
            startTime = new Date().getTime();
            const audioBlob = await convert(file);
            jumpStep();
            log("Sending file to server...", "status");
            const formData = new FormData();
            formData.append("file", audioBlob, "output.webm");
    
            const responseAudio = await fetch("/audio", {
                method: "POST",
                body: formData
            });
            const resultAudio = await responseAudio.json();
            if (resultAudio.status != 200) {
                log("Error uploading file.", "status")
                return;
            }
            log("File uploaded successfully.", "status");
    
            log("File compression started.", "status");
            const responseCompression = await fetch("/compression", {
                method: "POST",
                body: JSON.stringify(resultAudio),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const resultCompression = await responseCompression.json();
            if (resultCompression.status != 200) {
                log("Error compressing file.", "status")
                return;
            }
            log("File compression completed.", "status");
            jumpStep();
    
            log("Transcription started.", "status");
            const responseTranscribe = await fetch("/transcribe", {
                method: "POST",
                body: JSON.stringify(resultCompression),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const resultTranscribe = await responseTranscribe.json();
            if (resultTranscribe.status != 200) {
                log("Error transcribing file.", "status")
                return;
            }
            log("Transcription completed.", "status");
            jumpStep();
    
            log("Summary in progress.", "status");
            const responseSummary = await fetch("/summary", {
                method: "POST",
                body: JSON.stringify(resultTranscribe),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const resultSummary = await responseSummary.json();
            if (resultSummary.status != 200) {
                log("Error generating summary.", "status")
                return;
            }
            log("Summary completed.", "status");
            jumpStep();
            
            console.log(resultSummary);
            var path = resultSummary.summary_path;
            filename = path.split("/")[1];
            log("Download ready.", "status");
            download();
    
        } catch (error) {
            log("Error: " + error, "status");
        }
    } else {
        log("");
        log("No file selected.", "status");
    }
}

function download(){
    if (filename == ""){
        return;
    }

    var folder = filename.split("\\")[0];
    var filename_ = filename.split("\\")[1];

    fetch("/download", {
        method: "POST",
        body: JSON.stringify({folder: folder, filename: filename_}),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(json => {
                throw new Error(json.error || 'Unknown error');
            });
        }
        return response.blob(); // convert the response to a Blob
    })
    .then(blob => {
        var url = window.URL.createObjectURL(blob); // create a URL for the Blob
        var a = document.createElement('a'); // create a link element
        a.href = url; // set the href of the link to the Blob URL
        a.download = filename_; // set the filename
        a.click(); // simulate a click on the link
    })
    .catch(error => console.error(error));
}

async function convert(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Create a FileReader object

        reader.onload = function (event) {
            const videoData = new Uint8Array(event.target.result);
            console.log("FileReader loaded the file, size:", videoData.length);

            postToWorker(videoData, file.name, resolve, reject);
        };

        reader.onerror = function (error) {
            console.error("FileReader error:", error);
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

function postToWorker(videoData, filename, resolve, reject) {
    // Send a command to the worker to convert video to audio
    console.log("Video data:", videoData);
    console.log("Sending data to worker, filename:", filename, "data size:", videoData.length);
    worker.postMessage({
        type: 'command',
        arguments: ['-i', filename, '-vn', '-ac', '2', '-strict', '-2', '-f', 'webm', 'output.webm'],
        files: [{ name: filename, data: videoData }]
    });

    // Handle messages from the worker
    worker.onmessage = function (event) {
        var message = event.data;
        console.log(message.type);
        if (message.type === "stdout") {
            log(message.data);
            console.log(message);
        }else if (message.type === "done") {
            const audioData = message.data[0].data; // Audio file data
            const conversionStatus = document.getElementById("conversion-status");
            if (conversionStatus) {
                conversionStatus.textContent = "Conversion successful!";
            }
            endTime = new Date().getTime();
            console.log("Conversion time:", (endTime - startTime) / 1000, "seconds");
            resolve(new Blob([audioData], { type: 'audio/webm' }));
            
            // Trigger file download
            //downloadConvertedFile(audioBlob, 'converted_audio.wav');

            // Update conversion status on the page
            if (conversionStatus) {
                conversionStatus.textContent = "Conversion successful!";
            }
        } else if (message.type === "error") {
            // Handle error
            if (conversionStatus) {
                conversionStatus.textContent = "Error during conversion.";
            }
            console.error("Worker error:", message.data);
            reject(message.data);
        }
    };
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


