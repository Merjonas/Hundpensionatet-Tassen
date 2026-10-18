function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById("current-datetime")
        dateTimeElement.textContent = now.toLocaleString("sv-SE", {
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

let bookings = [];

function saveBookings() {
    localStorage.setItem("tassen-bookings", JSON.stringify(bookings))
}

function loadBookings() {
    const savedBookings = localStorage.getItem("tassen-bookings")

    if (savedBookings !== null) {
        bookings = JSON.parse(savedBookings);
    }
}

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const booking = {
        customerName: document.getElementById("namn").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("telefon").value,
        dogName: document.getElementById("hundnamn").value,
        breed: document.getElementById("ras").value,
        age: document.getElementById("alder").value,
        service: document.getElementById("tjanst").value,
        startDate: document.getElementById("startdatum").value,
        endDate: document.getElementById("slutdatum").value,
        information: document.getElementById("information").value
    };

    if (booking.endDate < booking.startDate) {
        alert("Slutdatum kan inte vara före startdatum.");
        return;
    }

    bookings.push(booking);

    saveBookings();
    bookingForm.reset();
});

function renderBookings() {
    const bookingList = document.getElementById("booking-list")
    bookingList.replaceChildren();
        if (bookings.length === 0) {
            const message = document.createElement("p")
            message.textContent = "Du har inga bokningar ännu.";
            bookingList.appendChild(message);
            return;
        }
        bookings.forEach(function(booking) {
            const article = document.createElement("article")
            const heading = document.createElement("h4");
            heading.textContent = booking.dogName;
            const customer = document.createElement("p");
            const dates = document.createElement("p");
            dates.textContent = "Tjänst: " + booking.customerName;
            const service = document.createElement("p")
            dates.textContent = "Datum: " + booking.startDate + " - " + booking.endDate;
            article.append(heading, customer, service, dates);
            bookingList.appendChild(article);
        });
    }

    const removeButton = document.createElement("button")
    removeButton.textContent = "Ta bort bokning.";
    removeButton.type = "button";
    removeButton.addEventListener("click", function() {
        removeBooking(bookings.id);
    })
    
    loadBookings(),
    renderBookings()

    