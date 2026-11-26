const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const bookingsFile = path.join(__dirname, "bookings.json");


// Create bookings.json if it doesn't exist
if (!fs.existsSync(bookingsFile)) {
    fs.writeFileSync(bookingsFile, "[]");
}


// Test backend
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working!"
    });
});


// Save booking
app.post("/api/bookings", (req, res) => {

    console.log("Booking request received");

    try {

        const booking = req.body;

        console.log("Booking data:", booking);

        let bookings = [];

        if (fs.existsSync(bookingsFile)) {
            const data = fs.readFileSync(bookingsFile, "utf8");

            if (data.trim() !== "") {
                bookings = JSON.parse(data);
            }
        }


        booking.bookingId =
            "MB" + Date.now().toString().slice(-6);

        booking.bookingDate =
            new Date().toLocaleString();


        bookings.push(booking);


        fs.writeFileSync(
            bookingsFile,
            JSON.stringify(bookings, null, 2)
        );


        console.log("Booking saved successfully");


        res.status(200).json({
            success: true,
            message: "Booking saved successfully",
            booking: booking
        });

    } catch (error) {

        console.error("BOOKING ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Could not save booking",
            error: error.message
        });
    }
});


app.listen(PORT, () => {

    console.log(
        `Movie Ticket Booking System running at http://localhost:${PORT}`
    );

});