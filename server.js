const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./index");
const DB = process.env.DB_CONNECTION_URL.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => {
    console.log(`MongoDB Connection success`.blue.bold);
  })
  .catch((err) => {
    console.log(err);
    console.log(`MongoDB Connection Error`.red.bold);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`.green.bold);
});
