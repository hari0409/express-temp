// imports
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");


// app instance
const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
}
// app.use(express.static(`${__dirname}/public`))

app.use("/api/v1/tours", require("./routes/tourRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

module.exports = app;