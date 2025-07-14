const express = require("express");
const Course = require("../models/Course");
const slugify = require("slugify");
const ytpl = require("ytpl");
const router = express.Router();

// ✅ Middleware to protect admin routes
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  return res.redirect("/login");
}

// ✅ Admin Dashboard
router.get("/admin/dashboard", isAdmin, async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.render("admin/dashboard", { user: req.session.user, courses });
});

// ✅ Add Course UI (multi-step form)
router.get("/admin/add-course", isAdmin, (req, res) => {
  res.render("admin/add-course", { user: req.session.user });
});

// ✅ Insert Playlist (Step 1)
router.post("/admin/playlist", isAdmin, async (req, res) => {
  try {
    const playlist = await ytpl(req.body.url, { pages: Infinity });

    const videos = playlist.items.map((v, i) => ({
      serial: i + 1,
      title: v.title,
      videoId: v.id,
      url: `https://www.youtube.com/watch?v=${v.id}`,
    }));

    const course = new Course({
      title: playlist.title,
      playlistId: playlist.id,
      playlistUrl: req.body.url,
      videos,
      slug: slugify(playlist.title, { lower: true }),
    });

    await course.save();
    res.json({ success: true, id: course._id, slug: course.slug });
  } catch (err) {
    console.error("YTPL Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to insert playlist" });
  }
});

// ✅ Course Info + Curriculum (Step 2 + 3)
router.post("/admin/details", isAdmin, async (req, res) => {
  try {
    const {
      courseId,
      description,
      duration,
      schedule,
      videoHours,
      instructor,
      image,
      certificate,
      curriculumModules,
      curriculumTopics,
    } = req.body;

    const curriculum = Array.isArray(curriculumModules)
      ? curriculumModules.map((mod, i) => ({
          module: mod,
          topics: curriculumTopics[i].split(",").map((t) => t.trim()),
        }))
      : [
          {
            module: curriculumModules,
            topics: curriculumTopics.split(",").map((t) => t.trim()),
          },
        ];

    await Course.findByIdAndUpdate(courseId, {
      description,
      duration,
      schedule,
      videoHours,
      instructor,
      image,
      certificate: certificate === "on",
      curriculum,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Details Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update course info" });
  }
});

// ✅ Edit existing course (from dashboard)
router.get("/admin/edit/:id", isAdmin, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.send("Course not found");
  res.render("admin/edit-course", { user: req.session.user, course });
});

// ✅ Update from edit-course form
router.post("/admin/edit/:id", isAdmin, async (req, res) => {
  try {
    const {
      description,
      instructor,
      image,
      duration,
      schedule,
      videoHours,
      certificate,
      curriculumModules,
      curriculumTopics,
    } = req.body;

    const curriculum = Array.isArray(curriculumModules)
      ? curriculumModules.map((mod, i) => ({
          module: mod,
          topics: curriculumTopics[i].split(",").map((t) => t.trim()),
        }))
      : [
          {
            module: curriculumModules,
            topics: curriculumTopics.split(",").map((t) => t.trim()),
          },
        ];

    await Course.findByIdAndUpdate(req.params.id, {
      description,
      instructor,
      image,
      duration,
      schedule,
      videoHours,
      certificate: certificate === "on",
      curriculum,
    });

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Edit Error:", err);
    res.status(500).send("Failed to update course");
  }
});

module.exports = router;
