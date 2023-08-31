var worker = new Worker("static/js/worker.js");
const outputElement = document.getElementById("output");
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
    const item = document.getElementById("message");
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
