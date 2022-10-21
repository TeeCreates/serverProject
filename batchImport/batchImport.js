"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const images = require("./images.json");
const services = require("./services.json");

// const images = require("./images");

const batchImport = async (dbname) => {
  try {
    // connecting to database
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    // products collection
    const db = client.db(dbname);
    const imagesToMongo = await db.collection("Images").insertMany(images);
    // companies collection

    const servicesToMongo = await db
      .collection("Services")
      .insertMany(services);
    // close connection
    console.log("data uploaded to mongo", imagesToMongo, servicesToMongo);
    client.close;
  } catch (err) {
    console.log(err);
  }
};

// batchImport("FinalProject");
