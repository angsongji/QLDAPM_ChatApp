import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { checkEmail, checkFullName } from "../lib/utils.js";
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, email, fullName } = req.body;
    const userId = req.user._id;

    const updateFields = {};

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = uploadResponse.secure_url;
    }
    if (email) {
      if (!checkEmail(email))
        return res.status(400).json({ message: "Invalid email" });
      const user = await User.findOne({ email: email.trim() });
      if (user)
        return res.status(400).json({ message: "Email already exists!" });
      updateFields.email = email;
    }
    if (fullName) {
      if (!checkFullName(fullName))
        return res
          .status(400)
          .json({ message: "Fullname between 6 and 64 letters long" });
      updateFields.fullName = fullName;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update user" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password -email"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error get users by full name:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
