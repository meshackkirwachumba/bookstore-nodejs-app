require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const bookRoutes = require("./routes/book-route");
const authRouter = require("./routes/auth-routes");
const adminRouter = require("./routes/admin-routes");
const imageRouter = require("./routes/image-routes");

const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
connectToDB();

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

//routes here
app.use("/api/books", bookRoutes);
app.use("/api/users", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/image", imageRouter);

//connect to server
app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`);
});
