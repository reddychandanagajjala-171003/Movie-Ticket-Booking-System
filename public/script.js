const ticketPrice = 200;

// Create seats
const seatContainer = document.getElementById("seatContainer");

const bookedSeats = ["A3", "B5", "C2", "D7"];

const rows = ["A", "B", "C", "D", "E"];
const seatsPerRow = 8;

rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {

        const seatNumber = row + i;

        const seat = document.createElement("div");

        seat.classList.add("seat");
        seat.textContent = seatNumber;

        // Mark already booked seats
        if (bookedSeats.includes(seatNumber)) {
            seat.classList.add("booked");
        }

        seat.addEventListener("click", () => {

            if (seat.classList.contains("booked")) {
                return;
            }

            seat.classList.toggle("selected");

            updateBookingSummary();
        });

        seatContainer.appendChild(seat);
    }
});


// Select movie from movie card
function selectMovie(movieName) {

    const movieSelect = document.getElementById("movie");

    movieSelect.value = movieName;

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
}


// Update booking summary
function updateBookingSummary() {

    const selectedSeats =
        document.querySelectorAll(".seat.selected");

    const seatNames = [];

    selectedSeats.forEach(seat => {
        seatNames.push(seat.textContent);
    });

    document.getElementById("selectedSeats").textContent =
        seatNames.length > 0
            ? seatNames.join(", ")
            : "None";

    const total = seatNames.length * ticketPrice;

    document.getElementById("ticketPrice").textContent =
        ticketPrice;

    document.getElementById("totalPrice").textContent =
        total;
}


// Confirm booking
document.getElementById("confirmBtn").addEventListener("click", async () => {

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerEmail =
        document.getElementById("customerEmail").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const movie =
        document.getElementById("movie").value;

    const showtime =
        document.getElementById("showtime").value;

    const selectedSeats =
        document.querySelectorAll(".seat.selected");

    const seatNames = [];

    selectedSeats.forEach(seat => {
        seatNames.push(seat.textContent);
    });


    // Validation
    if (customerName === "") {
        alert("Please enter your name.");
        return;
    }

    if (customerEmail === "") {
        alert("Please enter your email.");
        return;
    }

    if (customerPhone === "") {
        alert("Please enter your phone number.");
        return;
    }

    if (movie === "") {
        alert("Please select a movie.");
        return;
    }

    if (showtime === "") {
        alert("Please select a show time.");
        return;
    }

    if (seatNames.length === 0) {
        alert("Please select at least one seat.");
        return;
    }


    const total =
        seatNames.length * ticketPrice;


    const bookingData = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        movie: movie,
        showtime: showtime,
        seats: seatNames,
        ticketCount: seatNames.length,
        pricePerTicket: ticketPrice,
        totalAmount: total
    };


    try {

        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();


        if (!result.success) {
            alert("Booking could not be saved.");
            return;
        }


        // Show confirmation
        const confirmation =
            document.getElementById("confirmation");

        const ticketDetails =
            document.getElementById("ticketDetails");

        ticketDetails.innerHTML = `
            <p><strong>Name:</strong> ${result.booking.customerName}</p>
            <p><strong>Email:</strong> ${result.booking.customerEmail}</p>
            <p><strong>Phone:</strong> ${result.booking.customerPhone}</p>
            <p><strong>Movie:</strong> ${result.booking.movie}</p>
            <p><strong>Show Time:</strong> ${result.booking.showtime}</p>
            <p><strong>Seats:</strong> ${result.booking.seats.join(", ")}</p>
            <p><strong>Tickets:</strong> ${result.booking.ticketCount}</p>
            <p><strong>Price per Ticket:</strong> ₹${result.booking.pricePerTicket}</p>
            <p><strong>Total Amount:</strong> ₹${result.booking.totalAmount}</p>
            <p><strong>Booking ID:</strong> ${result.booking.bookingId}</p>
            <p><strong>Booking Date:</strong> ${result.booking.bookingDate}</p>
        `;

        confirmation.classList.remove("hidden");

        confirmation.scrollIntoView({
            behavior: "smooth"
        });


        // Mark selected seats as booked
        selectedSeats.forEach(seat => {
            seat.classList.remove("selected");
            seat.classList.add("booked");
        });


        // Update summary
        document.getElementById("selectedSeats").textContent = "None";
        document.getElementById("totalPrice").textContent = "0";


    } catch (error) {

        console.error("Booking error:", error);

        alert("Server error. Please try again.");
    }

});