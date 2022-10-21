"use strict";

const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const moment = require("moment");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//SERVICES

const getAllServices = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("FinalProject");
    const services = await db.collection("Services").find().toArray();
    if (services) {
      res.status(200).json({ status: 200, data: services });
    } else {
      res.status(400).json({ status: 404, data: "not found" });
    }
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};
// IMAGES
const getAllImages = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("FinalProject");
    const result = await db.collection("Images").find().toArray();
    if (result) {
      res.status(200).json({ status: 200, data: result });
    } else {
      res.status(404).json({ status: 404, data: "not found" });
    }
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getSpecificImage = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("FinalProject");
    const { imageId } = req.params;

    const specificImage = await db
      .collection("Images")
      .findOne({ _Id: imageId });
    console.log("specific image", specificImage);
    res.status(200).json({ status: 200, data: specificImage });

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteSpecificImage = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("FinalProject");
    const { imageId } = req.params;
    const deletedImage = await db
      .collection("Images")
      .deleteOne({ _Id: imageId });
    console.log("specific image", deletedImage);
    res.status(200).json({ status: 200, data: deletedImage });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const addImage = async (req, res) => {
  try {
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    const newImage = {
      _id: uuidv4(),
      description: req.body.description,
      image: req.body.image,
    };

    console.log(newImage);
    const newImageAdded = await db.collection("Images").insertOne(newImage);

    console.log("new image added", newImageAdded);
    res.status(200).json({ status: 200, data: newImageAdded });

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//BOOKINGS

const getAllBookings = async (req, res) => {
  try {
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    const getBookings = await db.collection("Bookings").find().toArray();

    res.status(200).json({ status: 200, data: getBookings });
    client.close();
  } catch {
    res
      .status(400)
      .json({ status: 400, message: "could not retrieve bookings" });
  }
};

const statusByDate = async (req, res) => {
  try {
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    const getBookings = await db.collection("Bookings").find().toArray();
    console.log(getBookings);

    const result = {};

    getBookings.forEach((day) => {
      const key = day.date;

      if (result[key]) {
        result[key] = result[key] + 1;
      } else {
        result[key] = 1;
        // first time
      }
    });

    res.status(200).json({ status: 200, data: result });
    client.close();
  } catch {
    res
      .status(400)
      .json({ status: 400, message: "could not retrieve bookings" });
  }
};

const getUsersBooking = async (req, res) => {
  try {
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    const { email } = req.params;

    const getBoooking = await db.collection("Bookings").find().toArray();

    const bookingsWithEmail = getBoooking.filter((booking) => {
      return booking.email === email;
    });

    res.status(200).json({ status: 200, data: bookingsWithEmail });
    client.close();
  } catch {
    res
      .status(400)
      .json({ status: 400, message: "could not retrieve booking" });
  }
};

const deleteSpecificBooking = async (req, res) => {
  try {
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    const { bookingId } = req.params;
    const deletedBooking = await db
      .collection("Bookings")
      .deleteOne({ _id: bookingId });

    res.status(200).json({ status: 200, data: deletedBooking });
    client.close();
  } catch {
    res
      .status(400)
      .json({ status: 400, data: "booking not deleted, something went wrong" });
  }
};

const addBooking = async (req, res) => {
  try {
    console.log("req.body", req.body);
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    //grab object
    const services = req.body.services;

    const newBooking = {
      _id: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      month: req.body.month,
      year: req.body.year,
      day: req.body.day,
      email: req.body.email,
      services: services,
      date: req.body.date,
      confirm: req.body.confirm,
      phone: req.body.phone,
    };

    // console.log("new boooking", newBooking);

    // add new booking into
    const newBookingAdded = await db
      .collection("Bookings")
      .insertOne(newBooking);

    console.log("added to mongo", newBooking);

    if (newBookingAdded) {
      res.status(200).json({ status: 200, data: newBookingAdded });
      client.close();
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    //connect to mongo
    const client = new MongoClient(MONGO_URI, options);
    console.log(MONGO_URI);
    await client.connect();
    const db = await client.db("FinalProject");

    const { bookingId } = req.params;

    const newBookingObject = req.body;

    console.log(newBookingObject);
    // console.log("did we get the object", newBookingObject);

    const findBooking = await db
      .collection("Bookings")
      .findOneAndReplace({ _id: bookingId }, newBookingObject);

    // console.log("found booking", findBooking);

    res.status(200).json({ status: 200, data: findBooking });
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

// make confirmned booking

const confirmBooking = async (req, res) => {
  //FOR ADMIN
  try {
    //connect to database
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("FinalProject");
    const { bookingId } = req.params;

    //find the booking request object
    const findBooking = await db
      .collection("Bookings")
      .findOne({ _id: bookingId });
    console.log("findbooking", findBooking);
    //make a confirm booking object

    // if the booking request object is found, when confirmed it will be added to the confirmed booking colleciton
    if (findBooking) {
      const confirmedBooking = {
        _id: uuidv4(),
        firstName: findBooking.firstName,
        lastName: findBooking.lastName,
        phoneNumber: findBooking.phoneNumber,
        email: findBooking.email,
        services: findBooking.services,
        serviceDate: findBooking.serviceDate,
        confirmedDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };
      await db.collection("Confirmed Bookings").insertOne(confirmedBooking);
    }

    // we also need to update the booking request from false to true

    if (findBooking) {
      const updateBooking = await db.collection("Bookings").findOneAndUpdate(
        { _id: bookingId },

        { $set: { confirm: true } }
      );
      console.log("update booking", updateBooking);
      res.status(200).json({ status: 200, data: updateBooking });
      client.close();
    }
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
};

module.exports = {
  confirmBooking,
  getAllImages,
  getSpecificImage,
  deleteSpecificImage,
  addImage,
  addBooking,
  updateBooking,
  deleteSpecificBooking,
  getUsersBooking,
  getAllBookings,
  statusByDate,
  getAllServices,
};
