// script.js

// Function to format a date as DD-MM-YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Function to get the date of the next occurrence of a given day
function getNextWeekDate(dayOfWeek) {
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(dayOfWeek);

    let nextDate = new Date(today.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7)));
    return formatDate(nextDate);
}

// Function to set the weekday headers in the table
function setWeekDates() {
    document.getElementById('monday-header').textContent = `Monday (${getNextWeekDate('Monday')})`;
    document.getElementById('tuesday-header').textContent = `Tuesday (${getNextWeekDate('Tuesday')})`;
    document.getElementById('wednesday-header').textContent = `Wednesday (${getNextWeekDate('Wednesday')})`;
    document.getElementById('thursday-header').textContent = `Thursday (${getNextWeekDate('Thursday')})`;
    document.getElementById('friday-header').textContent = `Friday (${getNextWeekDate('Friday')})`;
    document.getElementById('saturday-header').textContent = `Saturday (${getNextWeekDate('Saturday')})`;
    document.getElementById('sunday-header').textContent = `Sunday (${getNextWeekDate('Sunday')})`;
}

// Set the dates when the script loads
setWeekDates();

document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;

    const weekDays = [
        { day: 'Monday', time: document.getElementById('time-monday').value },
        { day: 'Tuesday', time: document.getElementById('time-tuesday').value },
        { day: 'Wednesday', time: document.getElementById('time-wednesday').value },
        { day: 'Thursday', time: document.getElementById('time-thursday').value },
        { day: 'Friday', time: document.getElementById('time-friday').value },
        { day: 'Saturday', time: document.getElementById('time-saturday').value },
        { day: 'Sunday', time: document.getElementById('time-sunday').value }
    ];

    const tableBody = document.querySelector('#scheduleTable tbody');
    const newRow = document.createElement('tr');

    // Add name to the first column
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    newRow.appendChild(nameCell);

    // Add times for each day with color coding
    weekDays.forEach(({ time }) => {
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        
        // Apply color coding based on time value
        if (time === '8AM to 5PM') {
            timeCell.classList.add('time-light-green');
        } else if (time === '12PM to 9PM') {
            timeCell.classList.add('time-peach');
        }
        
        newRow.appendChild(timeCell);
    });

    // Add a delete button to the row
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
        tableBody.removeChild(newRow);
    });
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Clear the form after submission
    document.getElementById('scheduleForm').reset();
});

// script.js

document.getElementById('exportButton').addEventListener('click', function() {
    // Hide the "Action" column before exporting
    const actionColumnCells = document.querySelectorAll('td:last-child, th:last-child');
    actionColumnCells.forEach(cell => cell.style.display = 'none');

    // Create a new container to temporarily hold the table
    const tableContainer = document.createElement('div');
    tableContainer.style.position = 'absolute';
    tableContainer.style.top = '-9999px';
    tableContainer.style.left = '-9999px';
    tableContainer.appendChild(document.getElementById('scheduleTable').cloneNode(true));
    document.body.appendChild(tableContainer);

    html2canvas(tableContainer, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'schedule.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Show the "Action" column again after exporting
        actionColumnCells.forEach(cell => cell.style.display = '');
        
        // Clean up the temporary container
        document.body.removeChild(tableContainer);
    }).catch(error => {
        console.error('Error generating image:', error);
    });
});

