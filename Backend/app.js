require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/HttpError");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/places", placeRoutes);

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
    throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
    if (req.file) {
        try {
            fs.unlink(req.file.path, (err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(req.file);
            console.log("Failed to remove file:", error.message);
        }
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
    .connect(
        `mongodb+srv://tbharath07:1234@cluster0.zdjb31h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log(err);
    });
