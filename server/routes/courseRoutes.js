const express = require("express");
const asyncHandler = require("../utils/WrapAsync.js");
const {
  createCourse,
  fetchCourses,
  updateCourse,
  deleteCourse,
  fetchUserCourses,
  fetchCourseById,
} = require("../controller/courseController.js");
const verifyToken = require("../middleware/index.js");
const router = express.Router();

router.route("/create-course").post(verifyToken, asyncHandler(createCourse));

router.route("/fetch").get(asyncHandler(fetchCourses));
router.route("/fetch/usercourse/:userId").get(asyncHandler(fetchUserCourses));

router
  .route("/:courseId")
  .get(asyncHandler(fetchCourseById))
  .put(asyncHandler(updateCourse))
  .delete(asyncHandler(deleteCourse));

module.exports = router;
