document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('No file selected.');
        return;
    }
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const text = e.target.result;
        processData(text);
    };

    reader.onerror = function() {
        alert('Error reading file');
    };

    reader.readAsText(file);
});

function processData(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim());
    if (rows.length <= 1) {
        alert('CSV does not contain enough data.');
        return;
    }

    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear previous items

    rows.slice(1).forEach((row, index) => {
        const item = row.split(',')[0]; // Assuming first column is the item
        const li = document.createElement('li');
        li.id = 'item-li-' + index;

        const span = document.createElement('span');
        span.textContent = item + " - ";
        li.appendChild(span);

        const timeDisplay = document.createElement('span');
        timeDisplay.id = 'time-' + index;
        timeDisplay.textContent = '0s';
        li.appendChild(timeDisplay);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start/Pause';
        startButton.onclick = () => toggleTimer(index);
        li.appendChild(startButton);

        itemList.appendChild(li);
    });
}

let currentTimerIndex = null;
const timers = {};
const times = {};

function toggleTimer(index) {
    if (currentTimerIndex !== null && currentTimerIndex !== index) {
        // Pause the currently running timer
        clearInterval(timers[currentTimerIndex]);
        document.getElementById('item-li-' + currentTimerIndex).classList.remove('active');
        delete timers[currentTimerIndex];
    }

    if (timers[index]) {
        // Pause this timer if it was already running
        clearInterval(timers[index]);
        document.getElementById('item-li-' + index).classList.remove('active');
        delete timers[index];
        currentTimerIndex = null;
    } else {
        // Start a new timer
        timers[index] = setInterval(() => {
            times[index] = (times[index] || 0) + 1;
            document.getElementById('time-' + index).textContent = times[index] + 's';
        }, 1000);
        document.getElementById('item-li-' + index).classList.add('active');
        currentTimerIndex = index;
    }
}

function downloadCSV() {
    Object.values(timers).forEach(clearInterval);
    let csvContent = "data:text/csv;charset=utf-8,Item,Time(s)\n";

    Object.keys(times).forEach(key => {
        const time = document.getElementById('time-' + key).textContent;
        csvContent += `Item ${key},${time.replace('s', '')}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'timer_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
