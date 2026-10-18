# Hundpensionatet-Tassen

A simple website for a doggy daycare. Built with HTML, CSS and JavaScript.

## About

I created this project as part of Frontend studies. The purpose was to practice working with the DOM, events and user input.

## Reflection

The most challenging part of this project was getting the booking system to work correctly, especially saving and removing bookings.
I learned how to use JavaScript events, arrays of objects, DOM manipulation and localStorage to manage data in the browser.

## Bug I fixed

When I implemented the booking list, removing a booking did not update the list correctly.
I found that I had been using renderChildren instead of replaceChildren() and Length was written instead of length.
I corrected these mistakes and tested the booking system again to make sure it worked as intended. 
This helped me understand the importance of checking properties.

## Layout

CSS grid for the services section because it allows the service cards the be in a clear two-column layout. 
On smaller screens the layout changes to a single column.
Flexbox for the staff section for easier alignment of staff cards, and to allow them to wrap when lacking space.
This allows the website to adapt to different screen sizes.

## Rendering bookings

I use forEach() to loop through the booking array and create HTML elements for each booking.
When a booking is added or removed I use renderBookings() again to update the displayed list.

## Scope and this

I use the Bokningslista class to manage bookings in a single object. By calling new Bokningslista(), I create an instance that contains the bokningar array. In the laggTill() method, I use this.bokningar to access the array belonging to the current object. When I call bokningslista.laggTill(booking), this refers to the bokningslista instance, allowing the method to update the correct array.

## Features

- Dynamic date and time display 
- Calculation of opening hours
- Booking form
- Bookings stored in localStorage
- Option to delete bookings
- Weather information via Open-Meteo

## Technologies

- HTML5
- CSS3
- JavaScript
- Fetch API
- localStorage

## How to run

1. Clone the repository.
2. Open the project folder in VS Code.
3. Start live server or open `index.html` in your browser.

## Project structure

Hundpensionatet-Tassen/
├── README.md
├── index.html
├── style.css
└── app.js

## Usage of AI
I've used AI to check for spelling mistakes and bugs.