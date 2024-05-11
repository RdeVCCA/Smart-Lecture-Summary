var timeP = 0;
var stepIndex = 0;
const progressSteps = [0]

function minToSec(min){
    return min * 60;
}

function secToMin(sec){
    return sec / 60;
}  

async function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));

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
    return sizeInMB;
}

function getVideoDuration(file) {
    return new Promise((resolve, reject) => {
        // Create a video element
        let video = document.createElement('video');

        // Create an object URL for the file
        let url = URL.createObjectURL(file);

        // When the metadata has been loaded, get the duration
        video.onloadedmetadata = function() {
            resolve(video.duration);
            URL.revokeObjectURL(url);
        };

        // If an error occurs, reject the Promise
        video.onerror = function() {
            reject("Error loading video file");
            URL.revokeObjectURL(url);
        };

        // Set the source of the video element
        video.src = url;
    });
}

function modelConversion(length){
    min = secToMin(length);
    estimateTime = 19*min + 28;
    return estimateTime;
}

function modelCompression(size){
    estimateTime = -38.6 + 15.6 * (Math.log(size));
    return estimateTime;
}

function modelTranscription(length){
    min = secToMin(length);
    estimateTime = 11.5*min + 38.5;
    return estimateTime;
}

function modelSummary(length){
    min = secToMin(length);
    estimateTime = 3.17*min + 26.9;
    return estimateTime;
}

async function startLoading(file){
    var videoLength = await getVideoDuration(file);
    var size = getsize(file);
    console.log("Video length: ", videoLength);
    console.log("Size: ", size);

    var totalEstimation = modelConversion(videoLength) + modelCompression(size) + modelTranscription(videoLength) + modelSummary(videoLength);
    const steps = [modelConversion(videoLength), modelConversion(videoLength)+modelCompression(size), modelConversion(videoLength)+modelCompression(size)+modelTranscription(videoLength), totalEstimation];
    // progressSteps[0] = 0.05*totalEstimation;
    for (let i = 0; i < steps.length; i++){
        progressSteps.push(steps[i]);
    }
    console.log("Progress steps: ", progressSteps);

    progressBar(totalEstimation);
}

function setProgress(progress){
    var progressBar = document.getElementById("loading-filler");
    var progressHint = document.getElementById("loading-hint");
    progress = Math.round(progress);
    if (progress < 5){
        progress = 5;
    }
    if (progress == 100){
        progress = 100;
    }
    // width: calc(progress% - 6px);
    progressHint.innerHTML = `${progress}`;
    progressBar.style.width = `calc(${progress}% - 6px)`;

}

async function testProgressBar(){
    for (let i = 0; i < 100; i++){
        setProgress(i);
        await sleep(250);
    }
}

async function progressBar(totalEstimation){
    timeP = progressSteps[stepIndex];
    setProgress((timeP/totalEstimation)*100);
    while (true){
        await sleep(250);
        if (stepIndex == progressSteps.length-1){
            timeP += 0.25;
            setProgress((timeP/totalEstimation)*100);
            if (timeP >= totalEstimation){
                break;
            }
        }else{
            if (timeP+0.25 > progressSteps[stepIndex+1]){
                continue;
            }else{
                timeP += 0.25;
                setProgress((timeP/totalEstimation)*100);
                console.log("Total estimation: ", totalEstimation);
                console.log("Current time: ", timeP);
            }
        }
    }
}

function jumpStep(){
    stepIndex += 1;
    timeP = progressSteps[stepIndex];
}