function updateDateTime() {
    const now = new Date();

    const dateTimeElement = document.getElementById("current-datetime")

    dateTimeElement.textContent = now.toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function updateOpeningStatus() {
    const now = new Date();

    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const currentTime = hours * 60 + minutes;

    const openingStatus = document.getElementById("opening-status");

    let isOpen = false;
        if (day >= 1 && day <= 5) {
            isOpen = currentTime >= 420 && currentTime < 1080;
        } else if (day === 6) {
            isOpen = currentTime >= 600 && currentTime < 840;
        } 

    if (isOpen) {
        openingStatus.textContent = "Vi har öppet!";
    } else {
        openingStatus.textContent = "Vi har stängt just nu.";
    }    
}

updateDateTime();
updateOpeningStatus();

setInterval(updateDateTime, 1000);
setInterval(updateOpeningStatus, 1000);

const bookingForm = document.getElementById("booking-form");
