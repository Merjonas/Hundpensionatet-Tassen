function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById("current-datetime");
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

function getTodayDate() {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

function setMinimumDate() {
    const today = getTodayDate();
    const startDateInput = document.getElementById("startdatum");
    const endDateInput = document.getElementById("slutdatum");
    startDateInput.min = today;
    endDateInput.min = today;

    startDateInput.addEventListener("change", function() {
        endDateInput.min = startDateInput.value || today;
        if (
            endDateInput.value &&
            endDateInput.value < endDateInput.min
        ) {
            endDateInput.value = "";
        }
    });
}

setMinimumDate();
updateDateTime();
updateOpeningStatus();
setInterval(updateDateTime, 1000);
setInterval(updateOpeningStatus, 1000);

const bookingForm = document.getElementById("booking-form");

class Bokningslista {
    constructor() {
        this.bokningar = [];
    }

    laggTill(bokning) {
        this.bokningar.push(bokning);
        this.spara();
    }

    taBort(id) {
        this.bokningar = this.bokningar.filter(function(bokning) {
            return bokning.id !== id;
        });
        this.spara();
    }

    spara() {
        localStorage.setItem("tassen-bookings", JSON.stringify(this.bokningar));
    }

    ladda() {
        const sparadeBokningar = localStorage.getItem("tassen-bookings");
        if (sparadeBokningar !== null) {
            try {
                const data = JSON.parse(sparadeBokningar);
                if (Array.isArray(data)) {
                    this.bokningar = data;
                }
            } catch (error) {
                console.error("Fel vid inläsning av bokningar:", error);
                this.bokningar = [];
            }
        }    
    }
}

const bokningslista = new Bokningslista();
bokningslista.ladda();

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const today = getTodayDate();
    const startDate = document.getElementById("startdatum").value;
        if (startDate < today) {
            alert("Startdatum måste vara framåt i tiden.");
            return;
        }

const booking = {
        id: crypto.randomUUID(),
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

    bokningslista.laggTill(booking);
    renderBookings();
    bookingForm.reset();
});

function renderBookings() {
    const bookingList = document.getElementById("booking-list");
    bookingList.replaceChildren();

    if (bokningslista.bokningar.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Inga bokningar hittas.";
        bookingList.appendChild(message);
        return;
    }
    
    bokningslista.bokningar.forEach(function(booking) {
        const article = document.createElement("article");
        const heading = document.createElement("h4");
        heading.textContent = booking.dogName;
        const customer = document.createElement("p");
        customer.textContent = "Ägare: " + booking.customerName;
        const service = document.createElement("p");
        service.textContent = "Tjänst: " + booking.service;
        const dates = document.createElement("p");
        dates.textContent = "Datum: " + booking.startDate + " - " + booking.endDate;
        const removeButton = document.createElement("button");
        removeButton.textContent = "Ta bort bokning.";
        removeButton.type = "button";
        removeButton.addEventListener("click", function() {
            removeBooking(booking.id);
        });

        article.append(
            heading,
            customer,
            service,
            dates,
            removeButton
        );

        bookingList.appendChild(article);
    });
}

function removeBooking(bookingId) {
    const confirmDelete = confirm("Vill du ta bort bokningen?");
    
    if (confirmDelete) {
        bokningslista.taBort(bookingId);
        renderBookings();
    }
}

    renderBookings();

const weatherForm = document.getElementById("weather-form");
const weatherLocation = document.getElementById("weather-location");
const weatherStatus = document.getElementById("weather-status");
const weatherResult = document.getElementById("weather-result");

async function getWeather(location) {
    const getcodingURL =  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=sv&format=json`;
    const locationResponse = await fetch(getcodingURL);
        if (!locationResponse.ok) {
            throw new Error("Kunde inte hämta platsinformation.");
        }

    const locationData = await locationResponse.json();
        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("Kunde inte hitta plats.");
        }
    
    const place = locationData.results[0];
    const forecastURL = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`;
    const weatherResponse = await fetch(forecastURL);
        if (!weatherResponse.ok) {
            throw new Error("Kunde inte hämta väderinformation.");
        }
    
    const weatherData = await weatherResponse.json();
        return {
                city: place.name,
                country: place.country,
                temperature: weatherData.current.temperature_2m,
                weatherCode: weatherData.current.weather_code
        }
}

weatherForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const location = weatherLocation.value.trim();
    weatherResult.replaceChildren();
        if (location === "") {
            weatherStatus.textContent = "Vänligen ange en plats.";
            return;
        }
    
        weatherStatus.textContent = "Hämtar väderinformation...";
        weatherStatus.dataset.status = "loading";
            try {
                const weather = await getWeather(location);
                const heading = document.createElement("h3");
                heading.textContent = `Väder i ${weather.city}, ${weather.country}`;
                const temperature = document.createElement("p");
                temperature.textContent = `Temperatur: ${weather.temperature} °C`;
                const description = document.createElement("p");
                description.textContent = `Väder: ${getWeatherDescription(weather.weatherCode)}`;
                weatherResult.append(heading, temperature, description);
                weatherStatus.textContent = "Väderinformation hämtad.";
                weatherStatus.dataset.status = "success";
            }
            catch (error) {
                weatherStatus.textContent = error.message;
                weatherStatus.dataset.status = "error";
                weatherResult.replaceChildren();
            }
});

function getWeatherDescription(code) {
    if (code === 0) {
        return "Klar himmel";
    }

    if ([1, 2, 3].includes(code)) {
        return "Delvis molnigt";
    }

    if ([45, 48].includes(code)) {
        return "Dimma";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "Duggregn";
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return "Regn";
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return "Snö";
    }

    if ([95, 96, 99].includes(code)) {
        return "Åska";
    }

    return "Väderinformation har hämtats";
}