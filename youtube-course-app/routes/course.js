const express = require("express");
const Course = require("../models/Course");
const User = require("../models/User");

const router = express.Router();

// ✅ 1. View a Course (Only if user is enrolled)
router.get("/course/:slug", async (req, res) => {
  const userId = req.session.user?._id;
  if (!userId) return res.redirect("/l");

  try {
    const user = await User.findById(userId).populate("enrolledCourses");
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) return res.status(404).send("Course not found");

    // Check if the user is enrolled in this course
    const isEnrolled = user.enrolledCourses.some((c) =>
      c._id.equals(course._id)
    );

    if (!isEnrolled) {
      return res.status(403).send("⚠️ Access denied. Please enroll first.");
    }

    const videos = course.videos || [];
    res.render("course", { course, videos, user: req.session.user });
  } catch (err) {
    console.error("Course Access Error:", err);
    res.status(500).send("Something went wrong");
  }
});

// ✅ 2. Enroll in a Course
router.post("/enroll/:courseId", async (req, res) => {
  const userId = req.session.user?._id;
  const courseId = req.params.courseId;

  if (!userId) return res.redirect("/l");

  try {
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    req.session.user = user;
    const course = await Course.findById(courseId);
    res.redirect(`/course/${course.slug}`);
  } catch (err) {
    console.error("Enroll Error:", err);
    res.status(500).send("Something went wrong");
  }
});

// ✅ 3. Show Enrolled Courses (/mycourses)
router.get("/mycourses", async (req, res) => {
  const userId = req.session.user?._id;
  if (!userId) return res.redirect("/l");

  try {
    const user = await User.findById(userId).populate("enrolledCourses");
    const enrolled = user.enrolledCourses || [];

    res.render("mycourses", {
      courses: enrolled,
      user: req.session.user,
    });
  } catch (err) {
    console.error("MyCourses Error:", err);
    res.status(500).send("Error loading courses");
  }
});
// ✅ About Course Page
router.get("/aboutcourse/:slug", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) return res.status(404).send("Course not found");

    res.render("aboutcourse", { course, user: req.session.user });
  } catch (err) {
    console.error("AboutCourse Error:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
