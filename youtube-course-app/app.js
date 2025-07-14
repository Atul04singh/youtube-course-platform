const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // Load .env config

const app = express();

// // 🔗 MongoDB Atlas Connection
// mongoose
//   .connect(process.env.local.MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB Atlas"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🟢 MongoDB Connection (Cleaned)
mongoose
  .connect("mongodb://127.0.0.1:27017/youtubeApp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// 🛠 Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret", // You can move this to .env if needed
    resave: false,
    saveUninitialized: true,
  })
);

// 🖼 View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 📁 Static Files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// 🧭 Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/home"));
app.use("/", require("./routes/course"));
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/settings"));
app.use("/", require("./routes/adminAuth"));
app.use("/", require("./routes/adminAuth")); // for admin login/register/logout
app.use("/", require("./routes/admin")); // for dashboard, add-course, etc.

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
