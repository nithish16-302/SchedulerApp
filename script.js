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
        } else if (time === '11PM to 8PM') {
            timeCell.classList.add('time-peach');
        } else if (time === 'WeekOff') {
            timeCell.classList.add('time-light-red');
        }
        
        newRow.appendChild(timeCell);
    });

     // Add edit and delete buttons to the row
     const actionCell = document.createElement('td');
    
     // Edit button
     const editButton = document.createElement('button');
     editButton.textContent = 'Edit';
     editButton.classList.add('edit-button');
     editButton.addEventListener('click', function() {
         editRow(newRow, name, weekDays);
     });
     actionCell.appendChild(editButton);
     
     // Delete button
     const deleteButton = document.createElement('button');
     deleteButton.textContent = 'Delete';
     deleteButton.classList.add('delete-button');
     deleteButton.addEventListener('click', function() {
         tableBody.removeChild(newRow);
     });
     actionCell.appendChild(deleteButton);
     
     newRow.appendChild(actionCell);

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Clear the form after submission
    document.getElementById('scheduleForm').reset();
});

// Function to edit the row
function editRow(row, oldName, oldWeekDays) {
    // Populate form fields with old data
    document.getElementById('name').value = oldName;
    document.getElementById('time-monday').value = oldWeekDays[0].time;
    document.getElementById('time-tuesday').value = oldWeekDays[1].time;
    document.getElementById('time-wednesday').value = oldWeekDays[2].time;
    document.getElementById('time-thursday').value = oldWeekDays[3].time;
    document.getElementById('time-friday').value = oldWeekDays[4].time;
    document.getElementById('time-saturday').value = oldWeekDays[5].time;
    document.getElementById('time-sunday').value = oldWeekDays[6].time;

    // Add a temporary "Update" button to replace the "Add to Schedule" button
    const submitButton = document.querySelector('#scheduleForm button[type="submit"]');
    submitButton.textContent = 'Update Schedule';

    // Add event listener for updating the row
    submitButton.addEventListener('click', function updateRow(event) {
        event.preventDefault();

        // Get updated values from form
        const updatedName = document.getElementById('name').value;
        const updatedWeekDays = [
            { day: 'Monday', time: document.getElementById('time-monday').value },
            { day: 'Tuesday', time: document.getElementById('time-tuesday').value },
            { day: 'Wednesday', time: document.getElementById('time-wednesday').value },
            { day: 'Thursday', time: document.getElementById('time-thursday').value },
            { day: 'Friday', time: document.getElementById('time-friday').value },
            { day: 'Saturday', time: document.getElementById('time-saturday').value },
            { day: 'Sunday', time: document.getElementById('time-sunday').value }
        ];

        // Update row with new data
        row.cells[0].textContent = updatedName;
        updatedWeekDays.forEach((day, index) => {
            const cell = row.cells[index + 1]; // Skip the name cell
            cell.textContent = day.time;

            // Update background color
            if (day.time === '8AM to 5PM') {
                cell.classList.add('time-light-green');
            } else if (day.time === '11PM to 8PM') {
                cell.classList.add('time-peach');
            } else if (day.time === 'WeekOff') {
                cell.classList.add('time-light-red');
            } else {
                cell.classList.remove('time-light-green', 'time-peach', 'time-light-red');
            }
        });

        // Reset form and submit button
        document.getElementById('scheduleForm').reset();
        submitButton.textContent = 'Add to Schedule';
        submitButton.removeEventListener('click', updateRow); // Remove this update listener
    }, { once: true }); // Ensure this event listener is called only once
}

document.getElementById('exportButton').addEventListener('click', function() {
    const table = document.getElementById('scheduleTable');
    // Get the table rows
    const rows = table.querySelectorAll('tr');

    // Create a canvas dynamically
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set cell dimensions and calculate canvas size
    const cellWidth = 200; // Width of each cell
    const cellHeight = 50; // Height of each cell
    const canvasWidth = cellWidth * (rows[0].children.length - 1); // Exclude Action th/td
    const canvasHeight = cellHeight * (rows.length); // Export all rows, except action
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill canvas with white background (default is transparent)
    ctx.fillStyle = '#ffffff'; // Set to white
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Fill entire canvas with white background

    // Set up font styles for text drawing
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Loop through rows (excluding Action th/td)
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');

        // Check if the first cell is "Action" (remove Action th/td columns)
        cells.forEach((cell, cellIndex) => {
            // Skip the last "Action" column (if any)
            if (cellIndex === cells.length - 1 && cell.textContent === 'Action') return;

            const text = cell.textContent.trim();
            const x = cellIndex * cellWidth;
            const y = rowIndex * cellHeight;

            // Get and persist background color, default to white if none
            const bgColor = window.getComputedStyle(cell).backgroundColor || '#ffffff';
            ctx.fillStyle = bgColor;
            ctx.fillRect(x, y, cellWidth, cellHeight);  // Draw cell background

            // Draw the cell border
            ctx.strokeRect(x, y, cellWidth, cellHeight);

            // Draw cell text
            ctx.fillStyle = '#000';  // Text color
            ctx.fillText(text, x + cellWidth / 2, y + cellHeight / 2);  // Centered text
        });
    });

    // Export the canvas as a JPEG image
    const link = document.createElement('a');
    link.download = 'table_details.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();  
});

