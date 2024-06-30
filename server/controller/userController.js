const connectToDB = require("../utils/db");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { jwtDecode } = require("jwt-decode");
const { generateToken } = require("../utils/jwt");

const signupUser = async (req, res) => {
  await connectToDB();
  const { email, firstName, lastName, password, username, isGoogle, image } =
    req.body;
  console.log(firstName);

  const existUser = await User.find({ email });

  if (existUser.length > 0) {
    return res
      .status(201)
      .json({ message: "User already exists", user: existUser });
  }

  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password && !isGoogle) {
    throw new Error("Missing field Password");
  }
  if (!isGoogle) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      firstName,
      username,
      lastName,
      password: hashedPassword,
      image,
      role,
    });

    const result = await user.save();
    return res.status(200).json({ message: "USERSIGNEDUP", user: result });
  }
  const user = new User({
    email,
    image,
    firstName,
    username,
    lastName,
  });
  const result = await user.save();
  return res.status(200).json({ message: "USERSIGNEDUP", user: result });
};

const loginUser = async (req, res) => {
  await connectToDB();
  const { email, password } = req.body;
  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password) {
    throw new Error("Missing field Password");
  }

  const user = await User.findOne({ email: email });

  if (!user) throw new Error("User does not exist");

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) throw new Error("Password's do not match");

  const token = generateToken(user);
  res
    .status(201)
    .cookie("acess_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "USERLOGGED",
      user: user,
      token: token,
    });
};

const handleGoogle = async (req, res) => {
  await connectToDB();
  const { token, role="student" } = req.body;
  const result = jwtDecode(token);
  const username = result.name;
  const firstName = result.given_name;
  const lastName = result.family_name;
  const email = result.email;
  const data = { username, firstName, lastName, email };
  const existUser = await User.find({ email, isGoogle: true, role: "admin" });

  if (existUser.length > 0) {
    return res
      .status(201)
      .json({ message: "User already exists", user: existUser[0] });
  }

  const user = new User({
    email,
    firstName,
    username,
    lastName,
    isGoogle: true,
    role
  });
  const savedUser = await user.save();
  return res.status(200).json({ message: "USERSIGNEDUP", user: savedUser });
};

const fetchUser = async (req, res) => {
  await connectToDB();
  const { userId } = req.params;
  const user = await User.findById(userId);

  res.status(201).json({ user: user });
};

const adminSignupUser = async (req, res) => {
  await connectToDB();
  const {
    email,
    firstName,
    lastName,
    password,
    username,
    isGoogle,
    image,
    role,
  } = req.body;
  console.log(firstName);

  const existUser = await User.find({ email, role: "admin" });

  if (existUser.length > 0) {
    return res
      .status(201)
      .json({ message: "User already exists", user: existUser });
  }

  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password && !isGoogle) {
    throw new Error("Missing field Password");
  }
  if (!isGoogle) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      firstName,
      username,
      lastName,
      password: hashedPassword,
      image,
      role,
    });

    const result = await user.save();
    return res.status(200).json({ message: "USERSIGNEDUP", user: result });
  }
  const user = new User({
    email,
    image,
    firstName,
    username,
    lastName,
  });
  const result = await user.save();
  return res.status(200).json({ message: "USERSIGNEDUP", user: result });
};
const adminLoginUser = async (req, res) => {
  await connectToDB();
  const { email, password } = req.body;
  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password) {
    throw new Error("Missing field Password");
  }

  const user = await User.findOne({ email: email, role: "admin" });

  if (!user) throw new Error("User does not exist");

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) throw new Error("Password's do not match");

  const token = generateToken(user);
  res
    .status(201)
    .cookie("acess_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "USERLOGGED",
      user: user,
      token: token,
    });
};

module.exports = {
  signupUser,
  loginUser,
  fetchUser,
  handleGoogle,
  adminLoginUser,
  adminSignupUser,
};
