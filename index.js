// The 'barcode-detector' library needs to be added in the same directory as this js file
import './barcode-detector/dist/es/index.js';

const video = document.getElementById('video');
const disclaimer = document.getElementById('disclaimer');
const resultElement = document.getElementById('result');
const inventoryTable = document.getElementById('inventoryTable');
var tableBody = document.getElementById("tableBody");
const scanBtn = document.getElementById('scanButton');
const newScanPopup = document.getElementById('newScanPopup');
var newValue = document.getElementById("newValue");
var newItemName = document.getElementById("newItemName");
var newReqQty = document.getElementById("reqQty");
var newQty = document.getElementById("newQty");
const reqQtyPopup = document.getElementById('reqQtyPopup');
var dropDownItem = document.getElementById('reqDropDown');
var dropDownRmv = document.getElementById('rmvDropDown');
var dropDownReqQty = document.getElementById('newReqQty');
const reqQtyBtn = document.getElementById("reqQtyBtn");
const rmvBtn = document.getElementById("rmvBtn");
const exceededPopup = document.getElementById("exceededPopup");
const closeButtons = document.querySelectorAll('#exceededPopup #close, #completedPopup #close');
const rmvPopup = document.getElementById('rmvPopup');
var confirmButtons = document.querySelectorAll('#newScanPopup #confirm, #reqQtyPopup #confirm, #rmvPopup #confirm'); //selects the confirm button on both popups
var cancelButtons = document.querySelectorAll('#newScanPopup #cancel, #reqQtyPopup #cancel, #rmvPopup #cancel'); //selects the cancel button on both popups
const completedPopup = document.getElementById("completedPopup");
let scanningPaused = false;
let scanInterval;

var rowData = { // The structure for each row of data
    codeValue: newValue,
    itemName: newItemName,
    reqQty: newReqQty,
    currentQty: newQty 
};

var rowIndex = 0;

// Array to store the structs of items to display on the table
// This acts as the database for this code. 
// Replace this part with functions to retrieve data from the database
var tableData = [{  codeValue: "4902179022226", 
                    itemName: "Lemon Tea", 
                    reqQty: 1,
                    currentQty: 0},
                //  {  codeValue: "4901085613580", 
                //     itemName: "Tully's Coffee Drink", 
                //     reqQty: 3,
                //     currentQty: 0},
                //  {  codeValue: "4901306069530", 
                //     itemName: "Wheat Drink", 
                //     reqQty: 3,
                //     currentQty: 0},
                ]; 
displayTable(0, 0);


/*
Brief:  This part of the code would firstly check if the browser is supported 
        with the mediaDevices interface provided by WebRTC API. 
        If the browser is supported, it would stream the feed from the environment 
        facing camera on devices and start scanning for barcodes or qr codes
        If the browser is not supported or if the camera is not accesable, it would 
        display a message in the disclaimer division of the browser.
*/
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
            disclaimer.innerHTML = 'Camera is not accessable';
            console.log('Error accessing camera: ', err);
        });
} else {
    disclaimer.innerHTML = 'getUserMedia is not supported on this browser';
    console.log('getUserMedia is not supported on this browser');
}


/*
Brief:  This function would start scanning for barcodes or qr codes.
        It will check the values of the barcodes with the values in the table.
        If the item scanned is already available in the table, the row would be
        highlighted and the scanned quantity column would be incremented.
        If the item does not exist in the table, the newScanPopup would be triggered
*/
function startScanning() {
    scanBtn.style.display = 'none';
    const barcodeDetector = new BarcodeDetector();
    scanInterval = setInterval(async function() {
        if (!video.paused && !video.ended && !scanningPaused) {
            try {
                const barcodes = await barcodeDetector.detect(video);
                if (barcodes && barcodes.length > 0) {
                    stopScanning();
                    resultElement.innerHTML = '';
                    // let foundMatch = false;

                    barcodes.forEach(barcode => {
                        resultElement.innerHTML += `<p>Type: ${barcode.format}, Value: ${barcode.rawValue}</p>`;
                        const existingRow = tableData.find(row => row.codeValue === barcode.rawValue);
                        rowIndex = tableData.findIndex(row => row.codeValue === barcode.rawValue);  
                        if(existingRow) {
                            //Increment quantity if the item already exists in tableData
                            existingRow.currentQty++;
                            // console.log("Increment:", rowIndex);
                            displayTable(1, rowIndex);
                            updateResult(1); //will change result element to say value has been incremented
                        }
                        else{
                            //add a new rowData in tableData is item is not found
                            newScanPopup.style.display = 'block'; // Barcode not found in the table, show popup
                            newValue.value = barcode.rawValue;
                            newItemName.value = '';
                            newReqQty.value = '';
                            newQty.value = '';
                        }
                    });
                }
            } catch (error) {
                disclaimer.innerHTML = 'Barcode detection error';
                console.error('Barcode detection error:', error);
            }
        }
    }, 1000); // Adjust scan interval as needed
}


/*
Brief:  This function would trigger the scanButton to appear and pause the 
        video feed to prevent any multiple scans of the barcode. It will 
        also reset the scanning interval to restart the scanning process.
*/
function stopScanning() {
    scanBtn.style.display = 'block';
    video.pause();
    clearInterval(scanInterval);
}

/*
Brief:  When the scanButton is clicked, the video feed would continue to play
        and the scanning process would resume
*/
scanBtn.addEventListener('click', function() {
    scanningPaused = false;
    video.play()
    displayTable(0, 0);
    startScanning();
})

/*
Brief:  confirmButtons is listening to 2 buttons in 2 different popups. 
        It will loop through to see which button is clicked. 
*/
confirmButtons.forEach(function(button) {
    button.addEventListener("click", confirmButton);
});

/*
Brief:  cancelButtons is listening to 2 buttons in 2 different popups. 
        It will loop through to see which button is clicked. 
        Based on the button clicked, the popup would disappear.
*/
cancelButtons.forEach(function(button) {
    button.addEventListener("click",  cancelButton);
});

function cancelButton(event) {
    var parentPopup = event.target.closest(".popup"); //find the parent popup

    if (parentPopup.id === "newScanPopup") {
        newValue.value = '';
        newItemName.value = '';
        newReqQty.value = '';
        newQty.value = '';
        parentPopup.style.display = 'none';
    }
    if (parentPopup.id === "reqQtyPopup") {
        dropDownReqQty.value = '';
        parentPopup.style.display = 'none';
    }
    if (parentPopup.id === "rmvPopup") {
        parentPopup.style.display = 'none';
    }
}

/*
Brief:  This function would identify which popup button is clickec on
        If newScanPopup button is clicked, the values input by the user 
        would be updated into the table 
        If the reqQtyPopup button is clicked, the value of the required 
        quantity would be updated for the specific item in the table
*/
function confirmButton(event) {
    var parentPopup = event.target.closest(".popup"); //find the parent popup

    if (parentPopup.id === "newScanPopup") {
        if (newValue && newItemName && newReqQty && newQty) {
            if (confirm('Are you sure you want to add this item?')) {
                rowData.codeValue = newValue.value;
                rowData.itemName = newItemName.value;
                rowData.reqQty = parseInt(newReqQty.value);
                rowData.currentQty = parseInt(newQty.value);
                tableData.push(rowData);
                const rowIndex = tableData.findIndex(row => row.codeValue === rowData.codeValue);
                displayTable(3, rowIndex);
                newScanPopup.style.display = 'none';
                updateResult(4); //result element will display that new item has been added
            }
        } else {
            alert('Please enter all required values.');
        }
    }   
    
    if (parentPopup.id === "reqQtyPopup") {
        if (confirm('Are you sure you want to edit the item?')) {
            const dropDownRow = tableData.find(row => row.itemName === dropDownItem.value);
            const dropDownIndex = tableData.findIndex(row => row.itemName === dropDownItem.value);
            dropDownRow.reqQty = parseInt(dropDownReqQty.value);           
            // console.log(tableData);
            // tableData.appendChild(dropDownRow);
            // console.log("DropDownRow:", dropDownIndex);
            displayTable(4, dropDownIndex);
            dropDownReqQty.value = '';
            reqQtyPopup.style.display = 'none';
            updateResult(2);
        }
    }

    if (parentPopup.id === "rmvPopup") {
        if (confirm('Are you sure you want to remove this item?')) {
            const dropDownRow = tableData.find(row => row.itemName === dropDownRmv.value);
            const dropDownIndex = tableData.findIndex(row => row.itemName === dropDownRmv.value);
            if (dropDownIndex !== -1) {
                tableData.splice(dropDownIndex, 1);
            }
            // console.log("DropDownRow:", dropDownIndex);
            displayTable(0, dropDownIndex);
            rmvPopup.style.display = 'none';
            updateResult(3);
        }
    }
}


/*
Brief:  This would wait for the reqQtyBtn to be clicked, then display the 
        popup in order to enter the required amount for the specific item
*/
reqQtyBtn.addEventListener('click', function() {
    reqQtyPopup.style.display = 'block';
    dropDownItem.innerHTML = "<option value='' selected disabled>Please select</option>"; // Reset dropdown
    tableData.forEach(function(row) {
        var option = document.createElement("option");
        option.text = row.itemName;
        option.value = row.itemName;
        dropDownItem.appendChild(option);
    })
});


/*
Brief:  This function would display the data in tableData into the 
        inventoryTable
*/
function displayTable(val, rowIndex) {
    tableBody.innerHTML = '';
    var arrayIndex = 0;
    // console.log(tableData);
    tableData.forEach(function(row) {
        if((val != 3) && (row.currentQty > row.reqQty)) {
            row.currentQty--;
            exceededPopup.style.display = 'block';
            // val = 2;
        }
        var tr = document.createElement('tr');
        tr.innerHTML =  "<td>" + row.codeValue + "</td>" +
                        "<td>" + row.itemName + "</td>" +
                        "<td>" + row.reqQty + "</td>" +
                        "<td>" + row.currentQty + "</td>";
        if (rowIndex === arrayIndex) {
            if (row.currentQty === row.reqQty) {val = 2;}
            switch (val) {
                case 0:
                    // do nothing
                    break;     
                case 1: // if there is an increment in the value 
                    tr.style.backgroundColor = 'lightgreen';
                    val = 0;
                    break;
                case 2: // if the current mets the req
                    // tr.classList.add('highlight');
                    tr.style.backgroundColor = 'darkgreen';
                    tr.style.color = 'white';
                    val = 0;
                    break;
                case 3:
                    tr.style.backgroundColor = 'turquoise';
                    val = 0;
                    break;
                case 4:
                    tr.style.backgroundColor = 'lightblue';
                    val = 0;
                    break;
            }
        }
        if(row.currentQty === row.reqQty){
            tr.style.backgroundColor = 'darkgreen';
            tr.style.color = 'white';
        }
        else if(row.currentQty > row.reqQty) {
            tr.style.backgroundColor = 'red';
            tr.style.color = 'white';
        }
           
        tableBody.appendChild(tr);
        arrayIndex++;
    })

    //check if all items have been added
    var completedList = 0; //value to increment if the item has been completed
    var numOfItems = tableData.length; //find total number of rows in the data
    tableData.forEach(function(row) {
        if(row.currentQty === row.reqQty) {
            completedList++;
        }
        if(completedList === numOfItems) {
            completedPopup.style.display = 'block';
        }
    })
}

closeButtons.forEach(function(button) {
    button.addEventListener("click",  closeButton);
});

function closeButton(event) {
    var parentPopup = event.target.closest(".popup"); //find the parent popup

    if (parentPopup.id === "exceededPopup") {
        exceededPopup.style.display = 'none';
    }
    if (parentPopup.id === "completedPopup") {
        exceededPopup.style.display = 'none';
    }
}

rmvBtn.addEventListener("click", function() {
    rmvPopup.style.display = 'block';
    dropDownRmv.innerHTML = "<option value='' selected disabled>Please select</option>"; // Reset dropdown
    tableData.forEach(function(row) {
        var option = document.createElement("option");
        option.text = row.itemName;
        option.value = row.itemName;
        dropDownRmv.appendChild(option);
    })
})

function updateResult(change) {
    switch(change) {
        case 1:
            resultElement.innerHTML = 'Item has been incremented.';
            break;
        case 2:
            resultElement.innerHTML = 'Required Quantity has been changed.';
            break;
        case 3:
            resultElement.innerHTML = 'Item has been removed.';
            break;
        case 4:
            resultElement.innerHTML = 'Item has been added.';
            break;
        default:
            // resultElement.innerHTML = '';
            break;
    }
}
