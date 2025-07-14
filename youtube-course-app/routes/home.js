const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

router.get("/home", async (req, res) => {
  const user = req.session.user;

  // Redirect to login if user is not authenticated
  if (!user) {
    return res.redirect("/");
  }

  try {
    const courses = await Course.find();
    res.render("index", { courses, user });
  } catch (err) {
    console.error("Error loading courses:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
