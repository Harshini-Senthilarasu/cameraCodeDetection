// The 'barcode-detector' library needs to be added in the same directory as this js file
import './barcode-detector/dist/es/index.js';

// declarations
const disclaimer = document.getElementById('disclaimer');
const video = document.getElementById('video');
const scanBtn = document.getElementById('scanButton');
const result = document.getElementById('result');
const reqQtyBtn = document.getElementById('reqQtyBtn');
const rmvBtn = document.getElementById('rmvBtn');
const inventoryTable = document.getElementById('inventoryTable');
const tableBody = document.getElementById('tableBody');

const newScanPopup = document.getElementById('newScanPopup');
const newValue = document.getElementById('newValue');
const newItemName = document.getElementById('newItemName');
const reqQty = document.getElementById('reqQty');
const scanQty = document.getElementById('scanQty');

const reqQtyPopup = document.getElementById('reqQtyPopup');
const reqDropDown = document.getElementById('reqDropDown');
const newReqQty = document.getElementById('newReqQty');

const exceededPopup = document.getElementById('exceededPopup');

const rmvPopup = document.getElementById('rmvPopup');
const rmvDropDown = document.getElementById('rmvDropDown');

const completedPopup = document.getElementById('completedPopup');

const confirmButtons = document.querySelectorAll('#newScanPopup #confirm, #reqQtyPopup #confirm, #rmvPopup #confirm');
const cancelButtons = document.querySelectorAll('#newScanPopup #cancel, #reqQtyPopup #cancel, #rmvPopup #cancel');
const closeButtons = document.querySelectorAll('#exceedPopup #close, #completedPopup #close');

let scanPaused = false; // trigger to be used to pause or play the video
let scanInterval;

/*
Brief:          Array to store the items and their values.
                This acts as the database. 
                Replace this part to retrieve data from database 
*/
var tableData = [{  codeValue: "4902179022226", 
                    itemName: "Lemon Tea", 
                    requiredQty: 1,
                    scannedQty: 0},
                // {   codeValue: "4901085613580", 
                //     itemName: "Tully's Coffee Drink", 
                //     requiredQty: 3,
                //     scannedQty: 0},
                // {   codeValue: "4901306069530", 
                //     itemName: "Wheat Drink", 
                //     requiredQty: 3,
                //     scannedQty: 0},
];

/*
Brief:          This function would display the tableData array 
                into the html page under thr inventoryTable division
Parameters:
*/
function displayTable(val, rowIndex) {
    tableBody.innerHTML = ''; // intialise table element
    var arrayIndex = 0;
    tableData.forEach(function(row) {
        if ((val != 3) && (row.scannedQty > row.requiredQty)) {
            row.scannedQty--;
            exceededPopup.style.display = 'block';
        }
        var tr = document.createElement('tr'); //create row element in the table body
        tr.innerHTML =  "<td>" + row.codeValue + "</td>" +
                        "<td>" + row.itemName + "</td>" +
                        "<td>" + row.requiredQty + "</td>" +
                        "<td>" + row.scannedQty + "</td>";

        if (rowIndex === arrayIndex) {
            if (row.scannedQty === row.requiredQty) {val = 2;}
            console.log(val);
            switch(val) {
                case 0:
                    //do nothing
                    break;
                case 1: //if there is an incremeent in the value
                    tr.style.backgroundColor = 'lightgreen';
                    val = 0;
                    break;
                case 2: // if the scanned qty meets the required qty
                    tr.style.backgroundColor = 'darkgreen';
                    tr.style.color = 'white';
                    val = 0;
                    break;
                case 3: // when a new item has been added
                    tr.style.backgroundColor = 'turquoise';
                    val = 0;
                    break;
                case 4: // when required amount has been changed
                    tr.style.backgroundColor = 'lightblue';
                    val = 0;
                    break;
            }
        }

        if(row.scannedQty === row.requiredQty){
            tr.style.backgroundColor = 'darkgreen';
            tr.style.color = 'white';
        }
        // else if(row.scannedQty > row.requiredQty) {
        //     tr.style.backgroundColor = 'red';
        //     tr.style.color = 'white';
        // }

        tableBody.appendChild(tr); // each row in the array would be added into the table in the html
        arrayIndex++;
    })    

    //check if all items have been added
    var completedList = 0; //value to increment if the item has been completed
    var numOfItems = tableData.length; //find total number of rows in the data
    console.log('Reached');
    tableData.forEach(function(row) {
        if(row.scannedQty === row.requiredQty) {
            completedList++;
            console.log(completedList);
        }
        if(completedList === numOfItems) {
            completedPopup.style.display = 'block';
        }
    })
}

/*
Brief:          This function would check if the browser is supported with the 
                mediaDevices interface provided by WebRTC Api
                If the browser is supported, it would start to stream the feed
                using the environment facing camera in devices and start to scan 
                for barcodes or qr codes. 
                If the browser is not supported or if the camera is not accessable, 
                it will display a message in the disclaimer division of the html page
*/
async function cameraInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // check if the browser supports getUserMedia
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false})
        .then(function(stream) {
            console.log('getUserMedia succeeded');
            video.srcObject = stream;
            video.onloadedmetadata = function() {
                video.play();
                displayTable(0, 0); //display of table 
                startScanning();
            };
        })
        .catch(function(err) {
            disclaimer.innerHTML = 'Camera is not accessable';
            console.error('Error accessing camera: ', err);
        });
    } else {
        disclaimer.innerHTML = 'getUserMedia is not supported on this browser';
        console.log('getUserMedia is not supported on this browser');
    }
}

cameraInit(); // start camera initialisation

/*
Brief:          This function would start scanning for barcodes or qr codes in the video
                It wil check if the qrcode or barcode is available in the tableData. 
                If it is available, it will increment the value and display on the table
                If it is not available, it will open the newScanPopup 
*/
function startScanning() {
    scanBtn.style.display = 'none';
    const barcodeDetector = new BarcodeDetector();
    scanInterval = setInterval(async function() {
        if (!scanPaused) { //&& !video.paused && !video.ended) {
            try {
                const barcodes = await barcodeDetector.detect(video);
                if (barcodes && barcodes.length > 0) {
                    scanPaused = true;
                    video.pause(); //pause video feed to prevent any extra scans
                    result.innerHTML = '';

                    barcodes.forEach(barcode => {
                        result.innerHTML = `<p>Type: ${barcode.format}, Value: ${barcode.rawValue}`;
                        const existingRow = tableData.find(row => row.codeValue === barcode.rawValue); //find row in tabledata that matches with barcode value
                        const existingRowIndex = tableData.findIndex(row => row.codeValue === barcode.rawValue); //find row index in tabledata that matches with barcode value
                        if (existingRow) {
                            existingRow.scannedQty++; //Increment the quantity of the item in that row in tableData
                            console.log('increment:',existingRow.requiredQty);
                            console.log(existingRow.scannedQty);
                            displayTable(1, existingRowIndex); // display changed value
                            result.innerHTML = `<p>${existingRow.itemName} has been incremented.<p>`; // display result in html
                        }
                        else { // if item does not exist in tableData, open up newScanPopup
                            newScanPopup.style.display = 'block'; //show popup
                            newValue.value = barcode.rawValue;
                            newItemName.value = '';
                            reqQty.value = '';
                            scanQty.value = '1';
                        }
                    });
                    scanBtn.style.display  = 'block'; //display scan button
                }

            }
            catch (error) {
                disclaimer.innerHTML = 'Barcode detection error';
                console.error('Barcode detection error:', error);
            }
        }
    }, 1000); //adjust scan interval as needed
}

/*
Brief:          This function would listen to the scan button being clicked.
                It will play the camera again
*/
scanBtn.addEventListener('click', function() {
    scanPaused = false; 
    result.innerHTML = '';
    // displayTable();
    cameraInit(); //restart cameera initialisation
})

/*
Brief:  The following three functions would be listening to which button is being clicked
        Confirm button and cancel button are present in newScanPopup, reqQtyPopup and rmvPopup
        Close button is present in exceedPopup and completedPopup
*/
confirmButtons.forEach(function(button) {
    button.addEventListener("click", confirmButton);
});

cancelButtons.forEach(function(button) {
    button.addEventListener("click",  cancelButton);
});

closeButtons.forEach(function(button) {
    button.addEventListener("click",  closeButton);
});


function cancelButton(event) {
    var parentPopup = event.target.closest(".popup"); // find the parent popup

    if (parentPopup.id === "newScanPopup") {
        newValue.value = '';
        newItemName.value = '';
        reqQty.value = '';
        scanQty.value = '';
        parentPopup.style.display = 'none';
    }
    if (parentPopup.id === "reqQtyPopup") {
        reqDropDown.innerHTML = "<option value='' selected disabled>Please select</option>"; // Reset dropdown
        newReqQty.value = '';
        parentPopup.style.display = 'none';
    }
    if (parentPopup.id === "rmvPopup") {
        rmvDropDown.innerHTML = "<option value='' selected disabled>Please select</option>"; // Reset dropdown
        parentPopup.style.display = 'none';
    }
}

function confirmButton(event) {
    var parentPopup = event.target.closest(".popup"); 

    if (parentPopup.id === "newScanPopup") {
        if (newValue && newItemName && reqQty && scanQty) {
            if (confirm('Are you sure you want to add this item?')) { // confirming by browser
                var rowData = {};
                rowData.codeValue = newValue.value;
                rowData.itemName = newItemName.value;
                rowData.requiredQty = parseInt(reqQty.value);
                rowData.scannedQty = parseInt(scanQty.value);
                console.log('New scan:',rowData.requiredQty);
                tableData.push(rowData); // add row into tableData

                const rowIndex = tableData.findIndex(row =>row.codeValue === rowData.codeValue);
                displayTable(3, rowIndex);
                newScanPopup.style.display = 'none';
                result.innerHTML = `<p>${rowData.itemName} has been added.<p>`;
            }
        }
        else {
            alert('Please enter all required values.');
        }
    }

    else if(parentPopup.id === "reqQtyPopup") {
        if (confirm('Are you sure you want to edit the item?')) {
            const dropDownRow = tableData.find(row => row.itemName === reqDropDown.value);
            dropDownRow.requiredQty = parseInt(newReqQty.value); 
            console.log('Required edit:',dropDownRow.requiredQty);
            const dropDownIndex = tableData.findIndex(row => row.itemName === reqDropDown.value);
            displayTable(4, dropDownIndex);
            reqDropDown.value = '';
            reqQtyPopup.style.display = 'none';
            result.innerHTML = `<p> Required quantity of ${dropDownRow.itemName} has been changed.<p>`;
            scanBtn.style.display = 'block';
        }
    }
    else if (parentPopup.id === "rmvPopup") {
        if (confirm('Are you sure you want to remove this item?')) {
            const dropDownRow = tableData.find(row => row.itemName === rmvDropDown.value);
            const dropDownIndex = tableData.findIndex(row => row.itemName === rmvDropDown.value);
            if (dropDownIndex !== -1) {
                tableData.splice(dropDownIndex, 1);
            }
            displayTable(0, 0);
            rmvPopup.style.display = 'none';
            result.innerHTML = `<p> ${dropDownRow.itemName} has been removed.<p>`; 
            scanBtn.style.display = 'block';
        }
    }
}

function closeButton(event) {
    var parentPopup = event.target.closest(".popup");

    if (parentPopup.id === "exceededPopup") {
        exceededPopup.style.display = 'none';
    }
    else if (parentPopup.id === "completedPopup") {
        completedPopup.style.display = 'none';
    }
}

/*
Brief:  This would wait for the reqQtyBtn to be clicked, then display the 
        popup in order to enter the required amount for the specific item
*/
reqQtyBtn.addEventListener('click', function() {
    scanPaused = true;
    video.pause();
    reqQtyPopup.style.display = 'block';
    reqDropDown.innerHTML = "<option value='' selected disabled>Please select</option>"; // Reset dropdown
    tableData.forEach(function(row) {
        var option = document.createElement("option");
        option.text = row.itemName;
        option.value = row.itemName;
        reqDropDown.appendChild(option);
    })
});

rmvBtn.addEventListener("click", function() {
    scanPaused = true;
    video.pause();
    rmvPopup.style.display = 'block';
    rmvDropDown.innerHTML = "<option value='' selected disabled>Please select</option>"; // Reset dropdown
    tableData.forEach(function(row) {
        var option = document.createElement("option");
        option.text = row.itemName;
        option.value = row.itemName;
        rmvDropDown.appendChild(option);
    })
})


