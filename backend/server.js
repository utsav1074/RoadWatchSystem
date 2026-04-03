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
const adminReportRoutes = require("./routes/adminReportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", reportRoutes);
app.use("/api", adminReportRoutes);
app.use("/api", reviewRoutes);
app.use("/api", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5000);
