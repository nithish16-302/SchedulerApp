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
    const table = document.getElementById('scheduleTable');
    
    // Get the table data and dimensions
    const rows = table.querySelectorAll('tr');
    const rowCount = rows.length;
    const colCount = rows[0].children.length;

    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas width and height based on table dimensions
    const cellWidth = 200; // Set a fixed width for cells
    const cellHeight = 50; // Set a fixed height for cells
    const canvasWidth = cellWidth * colCount;
    const canvasHeight = cellHeight * rowCount;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set up some basic styles
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Loop through rows and columns to draw the table
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');
        cells.forEach((cell, cellIndex) => {
            const text = cell.textContent;
            const x = cellIndex * cellWidth;
            const y = rowIndex * cellHeight;

            // Draw cell background
            ctx.fillStyle = rowIndex === 0 ? '#ffffe0' : '#fff'; // Header background is light yellow
            ctx.fillRect(x, y, cellWidth, cellHeight);

            // Draw cell border
            ctx.strokeRect(x, y, cellWidth, cellHeight);

            // Draw cell text
            ctx.fillStyle = '#000';
            ctx.fillText(text, x + cellWidth / 2, y + cellHeight / 2);
        });
    });

    // Export the canvas as a JPEG image
    const link = document.createElement('a');
    link.download = 'table_details.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();    
});

