import './barcode-detector/dist/es/index.js';
const video = document.getElementById('video');
const scanBtn = document.getElementById('scanButton');
const inventoryTable = document.getElementById('inventoryTable');
const popup = document.getElementById('popup');
const newValueInput = document.getElementById('newValue');
const newItemNameInput = document.getElementById('newItemName');
const confirmAddButton = document.getElementById('confirmAdd');
const cancelAddButton = document.getElementById('cancelAdd');

let scanningPaused = false;
let scanInterval;

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(function(stream) {
            console.log('getUserMedia succeeded');
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.play();
                startScanning();
            };
        })
        .catch(function(err) {
            console.log('Error accessing camera: ', err);
        });
} else {
    const disclaimer = document.getElementById('disclaimer');
    disclaimer.innerHTML = 'getUserMedia is not supported on this browser';
    console.log('getUserMedia is not supported on this browser');
}


// document.getElementById('video').addEventListener('play', function() {
//     startScanning()
// });

function startScanning() {
    const barcodeDetector = new BarcodeDetector();
    scanInterval = setInterval(async function() {
        if (!video.paused && !video.ended && !scanningPaused) {
            try {
                const barcodes = await barcodeDetector.detect(video);
                if (barcodes && barcodes.length > 0) {
                    stopScanning();
                    const resultElement = document.getElementById('result');
                    resultElement.innerHTML = '';
                    let foundMatch = false;

                    barcodes.forEach(barcode => {
                        resultElement.innerHTML += `<p>Type: ${barcode.format}, Value: ${barcode.rawValue}</p>`;

                        let rows = inventoryTable.getElementsByTagName('tr');
                        for (let i = 0; i < rows.length; i++) {
                            const cells = rows[i].getElementsByTagName('td');
                            for (let j = 0; j < cells.length; j++) {
                                if (cells[j].innerText === barcode.rawValue) {
                                    const itemQty = parseInt(cells[2].innerText);
                                    cells[2].innerText = itemQty + 1;
                                    rows[i].classList.add('highlight');
                                    foundMatch = true;
                                    break;
                                }
                            }
                            if (foundMatch) {
                                break;
                            }
                        }

                        if (!foundMatch) {
                            // Barcode not found in the table, show popup
                            popup.style.display = 'block';
                            newValueInput.value = barcode.rawValue;
                            newItemNameInput.value = '';
                        }
                    });
                }
            } catch (error) {
                console.error('Barcode detection error:', error);
            }
        }
    }, 1000); // Adjust scan interval as needed
}

function stopScanning() {
    video.pause();
    clearInterval(scanInterval);
}

scanBtn.addEventListener('click', function() {
    scanningPaused = false;
    video.play()
    startScanning();
})

confirmAddButton.addEventListener('click', function() {
    const newBarcode = newValueInput.value.trim();
    const newItemName = newItemNameInput.value.trim();

    if (newBarcode && newItemName) {
        if (confirm('Are you sure you want to add this item?')) {
            const tbody = inventoryTable.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${newItemName}</td><td>${newBarcode}</td><td>${0}</td>`;
            tbody.appendChild(newRow);
            popup.style.display = 'none';
        }
    } else {
        alert('Please enter both barcode and item name.');
    }
});

cancelAddButton.addEventListener('click', function() {
    popup.style.display = 'none';
});
