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
    require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload());
app.use(cors.corsAll);

const user = require("./routes/userRoute");
const booking = require("./routes/bookingRoute");
const address = require("./routes/addressRoute");
const category = require("./routes/categoryRoute");
const favorites = require("./routes/favoriteRoutes");
const car = require("./routes/carRoute");
const slide = require("./routes/slideRoute");
const sponsor = require("./routes/sponserRoute");
const contact = require("./routes/contactRoute");
const branch = require("./routes/branchesRoutes");
const gallery = require("./routes/galleryRoutes");
const payment = require("./routes/paymentRoute");
const faqs = require("./routes/faqRoutes");
const blogs = require("./routes/blogRoutes");

app.use("/api/v1/user", user);
app.use("/api/v1/cars", car);
app.use("/api/v1/favorites", favorites);
app.use("/api/v1/booking", booking);
app.use("/api/v1/address", address);
app.use("/api/v1/contact", contact);
app.use("/api/v1/slides", slide);
app.use("/api/v1/sponsor", sponsor);
app.use("/api/v1/branches", branch);
app.use("/api/v1/media/gallery", gallery);
app.use("/api/v1/payment", payment);
app.use("/api/v1/media/faqs", faqs);
app.use("/api/v1/media/blogs", blogs);
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
