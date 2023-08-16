async function convert(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);

            FFmpeg({
                arguments: ['-i', 'input.mp4', '-q:a', '0', '-map', 'a', 'output.wav'],
                files: [
                    {
                        data: data,
                        name: 'input.mp4'
                    }
                ]
            }).then(result => {
                const audioData = new Blob([result[0].data], { type: 'audio/wav' });
                resolve(audioData);
                return audioData;
            }).catch(reject);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
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
