var worker = new Worker("static/js/worker.js");
const outputElement = document.getElementById("ffmpeg-output");
const statusElement = document.getElementById("ffmpeg-status");
const fileNameDisplay = document.getElementById("file-name");
const conversionStatus = document.getElementById("conversion-status");
let startTime;
let endTime;

async function log(text){
    const ele = document.getElementById("ffmpeg-output");
    ele.innerHTML += text + "<br>";
}

function message(msg){
    const item = document.getElementById("warning");
    if(item) {
        item.textContent = msg;
    }
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

worker.onmessage = function (event) {
    var message = event.data;
    switch (message.type) {
      case "ready":
        statusElement.textContent = "FFmpeg is ready";
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
    // const fileNameDisplay = document.getElementById("file-name");

    if (file) {
        // display file name next to upload button
        log(file.name);
        try {
            startTime = new Date().getTime();
            const audioBlob = await convert(file);
            log("Sending file to server...");
            const formData = new FormData();
            formData.append("file", audioBlob, "output.webm");
    
            const responseAudio = await fetch("/audio", {
                method: "POST",
                body: formData
            });
            const resultAudio = await responseAudio.json();
            if (resultAudio.status != 200) {
                log("Error uploading file.")
                return;
            }
            log("File uploaded successfully.");
    
            log("File compression started.");
            const responseCompression = await fetch("/compression", {
                method: "POST",
                body: JSON.stringify(resultAudio),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const resultCompression = await responseCompression.json();
            if (resultCompression.status != 200) {
                log("Error compressing file.")
                return;
            }
            log("File compression completed.");
    
            log("Transcription started.");
            const responseTranscribe = await fetch("/transcribe", {
                method: "POST",
                body: JSON.stringify(resultCompression),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const resultTranscribe = await responseTranscribe.json();
            if (resultTranscribe.status != 200) {
                log("Error transcribing file.")
                return;
            }
            log("Transcription completed.");
    
            log("Summary in progress.");
            const responseSummary = await fetch("/summary", {
                method: "POST",
                body: JSON.stringify(resultTranscribe),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const resultSummary = await responseSummary.json();
            if (resultSummary.status != 200) {
                log("Error generating summary.")
                return;
            }
            log("Summary completed.");
            
            console.log(resultSummary);
    
        } catch (error) {
            log("Error: " + error);
        }
    } else {
        log("");
        log("No file selected.");
    }
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

// remove once not needed
function downloadConvertedFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

// add back once download feature is removed Post data into backend
// function postToWorker(videoData, filename, resolve, reject) {
//     // Send a command to the worker to convert video to audio
//     worker.postMessage({
//         type: 'command',
//         arguments: ['-i', filename, '-vn', '-ar', '44100', '-ac', '2', '-ab', '192k', '-f', 'mp3', 'output.mp3'],
//         files: [{ name: filename, data: videoData }]
//     });

//     // Handle messages from the worker
//     worker.onmessage = function (event) {
//         var message = event.data;

//         if (message.type === "done") {
//             // conversion is complete
//             const audioData = message.data[0].data; // Audio file data
//             const conversionStatus = document.getElementById("conversion-status");
//             if (conversionStatus) {
//                 conversionStatus.textContent = "Conversion successful!";
//             }
//             resolve(new Blob([audioData], { type: 'audio/mp3' }));
//         } else if (message.type === "error") {
//             // Handle error
//             const conversionStatus = document.getElementById("conversion-status");
//             if (conversionStatus) {
//                 conversionStatus.textContent = "Error during conversion.";
//             }
//             reject(message.data);
//         }
//     };
// }

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


