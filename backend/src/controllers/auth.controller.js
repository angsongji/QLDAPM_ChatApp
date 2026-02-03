import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateToken,
  checkPassword,
  checkFullName,
  checkEmail,
} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { email, fullName, password, profilePic } = req.body;
  try {
    if (!checkFullName(fullName))
      return res
        .status(400)
        .json({ message: "Fullname between 6 and 64 letters long" });

    if (!checkEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!checkPassword(password))
      return res.status(400).json({
        message:
          "Password must be 8–64 characters long, 1 uppercase letter, 1 digit, no spaces, no special characters",
      });

    const user = await User.findOne({ email: email.trim() });
    if (user) return res.status(400).json({ message: "Email already exists!" });

    let imageURL = profilePic;
    if (profilePic.includes("base64")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        imageURL = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error upload avatar sign up ", error);
        return res
          .status(500)
          .json({ message: "Internal Server Error Upload Image" });
      }
    }

    //hash password use bscriptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic: imageURL,
    });

    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!checkEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!checkPassword(password))
      return res.status(400).json({
        message: "Invalid password format",
      });

    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    else {
      const isPassCorrect = await bcrypt.compare(password, user.password);
      if (!isPassCorrect)
        return res.status(400).json({ message: "Invalid credentials" });
      generateToken(user._id, res);
      res.status(200).json({
        _id: user.id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
