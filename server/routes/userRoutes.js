const express = require("express");
const { signupUser, loginUser, fetchUser, handleGoogle, adminSignupUser, adminLoginUser } = require("../controller/userController");
const asyncHandler = require('../utils/WrapAsync.js');
const router = express.Router();

router.route("/signup").post(asyncHandler(signupUser));
router.route("/login").post(asyncHandler(loginUser));
router.route("/google").post(asyncHandler(handleGoogle));
router.route("/user/:userId").get(asyncHandler(fetchUser));

router.route("/admin/signup").post(asyncHandler(adminSignupUser))
router.route("/admin/login").post(asyncHandler(adminLoginUser))

module.exports = router