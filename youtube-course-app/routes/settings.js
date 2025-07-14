const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");

// GET /settings
router.get("/settings", async (req, res) => {
  const userId = req.session.user?._id;
  if (!userId) return res.redirect("/login");

  try {
    const user = await User.findById(userId).populate("enrolledCourses");
    res.render("settings", { user });
  } catch (err) {
    console.error("Settings Error:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
