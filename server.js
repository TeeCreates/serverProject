"use strict";

const express = require("express");
const morgan = require("morgan");
const { auth } = require("express-oauth2-jwt-bearer");

const PORT = 8000;

const app = express();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "finalProjectBackend",
  issuerBaseURL: `https://dev-hq5y-6vy.us.auth0.com`,
});

// auth router attaches /login, /logout, and /callback routes to the baseURL

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.status(200).json({ message: "public" });
});

//test api

app.get("/fetch-message", checkJwt, function (req, res) {
  res.status(200).json({ message: "authenticated" });
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, HEAD, GET, PUT, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(morgan("tiny"));
app.use(express.static("./server/assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/"));

const {
  getAllServices,
  getAllImages,
  statusByDate,
  getSpecificImage,
  deleteSpecificImage,
  addImage,
  addBooking,
  updateBooking,
  deleteSpecificBooking,
  getUsersBooking,
  getAllBookings,
  confirmBooking,
} = require("./handlers");

// endpoints
// IMAGES
app.get("/api/images", getAllImages);
app.get("/api/images/:id", getSpecificImage);
app.delete("/api/images/:id", deleteSpecificImage);
app.post("/api/add-image", addImage);

// //BOOKINGS
app.get("/api/bookings", getAllBookings);
app.get("/api/bookings/:email", getUsersBooking);
app.delete("/api/bookings/:bookingId", deleteSpecificBooking);
app.post("/api/add-booking", addBooking);
app.put("/api/update/:bookingId", updateBooking);
app.get("/api/booking-status-by-date", statusByDate);

//CONFIRM BOOKING

app.post("/api/confirmBooking/:bookingId", confirmBooking);

//GET ALL SERVICES

app.get("/api/services", getAllServices);

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for.",
  });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
