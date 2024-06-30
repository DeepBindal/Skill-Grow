const Course = require("../models/course"); // Assuming you have the Course model in models/Course.js
const connectToDB = require("../utils/db");

// Create a new course
const createCourse = async (req, res) => {
  await connectToDB();
  const course = new Course(req.body);
  await course.save();
  res.status(201).json({ message: "Course created successfully", course });
};

// Fetch all courses
const fetchCourses = async (req, res) => {
  await connectToDB();
  const courses = await Course.find();
  res.status(200).json(courses);
};

//fetch a particular course
const fetchCourseById = async (req, res) => {
  await connectToDB();
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  res.status(200).json(course);
};

//fetch for a particular user
const fetchUserCourses = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  await connectToDB();
  const courses = await Course.find({ by: userId }).populate("by");
  res.status(200).json(courses);
};

// Update a course by ID
const updateCourse = async (req, res) => {
  await connectToDB();
  const { courseId } = req.params;
  const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Validate before updating
  });
  if (!updatedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }
  res
    .status(200)
    .json({ message: "Course updated successfully", updatedCourse });
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  await connectToDB();
  const { courseId } = req.params;
  const deletedCourse = await Course.findByIdAndDelete(courseId);
  if (!deletedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.status(200).json({ message: "Course deleted successfully" });
};

module.exports = {
  createCourse,
  fetchCourses,
  updateCourse,
  deleteCourse,
  fetchUserCourses,
  fetchCourseById
};
