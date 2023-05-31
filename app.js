const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const cors = require("./utils/cors.js");
const cloudinary = require("cloudinary");
const app = express();

// config
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors.corsAll);

const user = require("./routes/userRoute");
const booking = require("./routes/bookingRoute");


const category = require("./routes/categoryRoute");
const favorites = require('./routes/favoriteRoutes');
const car = require("./routes/carRoute");

app.use("/api/v1/user", user);
app.use("/api/v1/cars", car);
app.use('/api/v1/favorites', favorites);
app.use("/api/v1/booking", booking);

app.use("/api/v1", category);


// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Server is Running! 🚀");
    });
}

// error middleware
app.use(errorMiddleware);

module.exports = app;
