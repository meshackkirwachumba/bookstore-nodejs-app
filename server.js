require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const bookRoutes = require("./routes/book-route");

const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
connectToDB();

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

//routes here
app.use("/api/books", bookRoutes);

//connect to server
app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`);
});
