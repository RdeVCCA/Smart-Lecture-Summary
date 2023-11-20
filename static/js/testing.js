var worker = new Worker("static/js/worker.js");
const outputElement = document.getElementById("ffmpeg-output");
const statusElement = document.getElementById("ffmpeg-status");
const fileNameDisplay = document.getElementById("file-name");
const conversionStatus = document.getElementById("conversion-status");

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

  async function convert(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

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

// add back once download feature is removed
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


//remove once not needed
function postToWorker(videoData, filename, resolve, reject) {
    // Send a command to the worker to convert video to audio
    console.log("Sending data to worker, filename:", filename, "data size:", videoData.length);
    worker.postMessage({
        type: 'command',
        arguments: ['-i', filename, '-vn', '-ar', '44100', '-ac', '2', '-ab', '192k', '-f', 'mp3', 'output.mp3'],
        files: [{ name: filename, data: videoData }]
    });

    // Handle messages from the worker
    worker.onmessage = function (event) {
        var message = event.data;

        if (message.type === "done") {
            // Conversion is complete
            console.log("Worker finished processing, message:", message);
            const audioData = message.data[0].data;

            if (!audioData || audioData.length === 0) {
                console.error("No audio data received from the worker");
                reject(new Error("No audio data received from the worker"));
                return;
            }

            const audioBlob = new Blob([audioData], { type: 'audio/mp3' });

            // Trigger file download
            downloadConvertedFile(audioBlob, 'converted_audio.mp3');

            // Update conversion status on the page
            if (conversionStatus) {
                conversionStatus.textContent = "Conversion successful!";
            }

            resolve(audioBlob);
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
console.log(outputElement);
console.log(statusElement);
console.log(fileInput);
