const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/books", require("./routes/bookRoutes"));

app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000");
});