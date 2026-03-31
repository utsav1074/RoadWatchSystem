const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", reportRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});


app.listen(5000);
