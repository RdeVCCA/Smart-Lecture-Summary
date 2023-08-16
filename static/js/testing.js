function convert(file){
    return file
}

function getsize(file){
    return "size"
}

function upload(){
    const fileInput = document.getElementById("audio");
    const file = fileInput.files[0];

    if (file) {
        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append("file", convert(file));

        // Send the file using a fetch POST request
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            message(result)
        })
        .catch(error => {
            message("Error uploading file:" + error)
        });
    } else {
        message("No file selected.")
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
        message(result)
    })
    .catch(error => {
        message("Error listing files:" + error)
    });
}