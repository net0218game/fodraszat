document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const fromInput = document.getElementById('dateFrom');
    const toInput = document.getElementById('dateTo');

    fetch('/api/appointments')
        .then(response => response.json())
        .then(data => {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                locale: 'hu',
                initialView: 'timeGridWeek',
                slotLabelFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                },
                headerToolbar: {
                    left: 'timeGridWeek,timeGridDay',
                    center: 'title',
                    right: 'prev,next today'
                },
                businessHours: {
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '08:00',
                    endTime: '20:00'
                },
                slotMinTime: "08:00:00",
                slotMaxTime: "20:00:00",
                selectable: true,
                selectMirror: true,
                allDaySlot: false,
                weekends: false,
                select: function (info) {
                    let start = new Date(info.start.getTime() - (info.start.getTimezoneOffset() * 60000));
                    let end = new Date(info.end.getTime() - (info.end.getTimezoneOffset() * 60000));
                    let formattedStart = start.toISOString().slice(0, 16);
                    let formattedEnd = end.toISOString().slice(0, 16);

                    // Check if the selected time is within the allowed range (08:00 - 20:00)
                    if (start.getHours() < 8 || end.getHours() > 20) {
                        alert("Csak 08:00 és 20:00 között lehet foglalni!");
                        fromInput.value = '';
                        toInput.value = '';
                        return;
                    }

                    // Check if the appointment duration exceeds 2 hours
                    const duration = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
                    if (duration > 2) {
                        alert("Az időpontok maximum 2 órásak lehetnek!");
                        fromInput.value = '';
                        toInput.value = '';
                        return;
                    }

                    // Check if the selected time conflicts with existing bookings
                    let conflictFound = false;
                    for (let unavailable of data) {
                        let unStart = new Date(unavailable.dateFrom);
                        let unEnd = new Date(unavailable.dateTo);
                        unStart = new Date(unStart.getTime() - unStart.getTimezoneOffset() * 60000);
                        unEnd = new Date(unEnd.getTime() - unEnd.getTimezoneOffset() * 60000);

                        // Check for time overlap
                        if ((start >= unStart && start < unEnd) || (end > unStart && end <= unEnd)) {
                            conflictFound = true;
                            alert("A kiválasztott időpont nem elérhető!");
                            break;
                        }
                    }

                    if (!conflictFound) {
                        fromInput.value = formattedStart;
                        toInput.value = formattedEnd;
                    } else {
                        fromInput.value = '';
                        toInput.value = '';
                    }
                },
                events: data.map(slot => ({
                    title: "Foglalt",
                    start: slot.dateFrom,
                    end: slot.dateTo,
                    color: "#ff0000"
                })),
                validRange: {
                    start: new Date().toISOString().split('T')[0]
                }
            });

            calendar.render();
        })
        .catch(error => console.error('Error fetching appointments:', error));
});