importScripts("https://tingan1212.github.io/static/frameworks/ffmpeg.js");
console.log("FFmpeg.js loaded from: https://tingan1212.github.io/static/frameworks/ffmpeg.js");

function print(text) {
  postMessage({
    'type': 'stdout',
    'data': text
  });
}

onmessage = function(event) {
  const module = {
    files: event.data.files || [],
    arguments: event.data.arguments || [],
    print: print,
    printErr: print
  };

  postMessage({ 'type': 'start', 'data': module.arguments });

  const result = ffmpeg_run(module);

  if (result && result.length > 0) {
    console.log('Worker finished processing. Output:', JSON.stringify(result, null, 2));
    if (result[0].data) {
      console.log('Output size:', result[0].data.length, 'bytes');
    }
  }  

  postMessage({ 'type': 'done', 'data': result });
};

postMessage({ 'type': 'ready' });
