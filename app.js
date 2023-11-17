const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const router = require("./routes");
const app = express();
const PORT = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const DB_URI = `mongodb+srv://habibsaeed:habibsaeed@cluster0.diosgkh.mongodb.net/`;
mongoose.connect(DB_URI);
mongoose.connection.on("connected", () =>
  console.log("My MongoDB Is Connected")
);
mongoose.connection.on("error", (err) => console.log("Error In MongoDb", err));

app.get("/", (req, res) => {
  res.json({
    message: "server up",
  });
});

app.listen(PORT, () => {
  console.log(`Server Is Running On localhost:${PORT}`);
});
