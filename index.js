import ('barcode-detector');

var resultElement = document.getElementById('result');
var disclaimerElement = document.getElementById('disclaimer');


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { //check if the navigator api is supported in the browser
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(function(stream) {
            console.log('getUserMedia succeeded');
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
        })
        .catch(function(err) {
            console.log('Error accessing camera: ', err);
        });
} else {
    disclaimerElement.innerHTML = 'This browser is not supported. Please try a different browser';
    console.log('getUserMedia is not supported on this browser');
}

document.getElementById('video').addEventListener('play', detectBarQRCodes()); // when video is streaming, the function would be activated


async function detectBarQRCodes() {  
    const barcodeDetector = new BarcodeDetector();
    const scanInterval = setInterval(async function() {
        if (!this.paused && !this.ended) {
        try {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes && barcodes.length > 0) {
                const resultElement = document.getElementById('result');
                resultElement.innerHTML = '';
                barcodes.forEach(barcode => {
                    resultElement.innerHTML += `Detected Code: ${barcode.rawValue}</p>`;
                });
            }
        } catch (error) {
            console.error('Barcode detection error:', error);
        }
        }
    }, 1000); // Adjust scan interval as needed
}
