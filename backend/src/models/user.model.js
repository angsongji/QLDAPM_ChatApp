import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: [64, "Email must be at most 64 characters long"],
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
      maxlength: [64, "Fullname must be at most 64 letters long"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
    profilePic: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        255,
        "Profile picture URL must be at most 255 characters long",
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); //user nhung mongo se tao la users

export default User;
