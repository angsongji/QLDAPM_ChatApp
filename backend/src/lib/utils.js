import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  //Generate token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //Save to user's cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV != "development",
  });

  return token;
};

export const checkPassword = (password) => {
  // pair // means a regex expression
  // Password can't include space, special characters
  // Password between 8-64 characters
  // Password at least 1 uppercase character
  // Password at least 1 digit
  if (typeof password !== "string") return false;
  const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?!.*[\s\W])[A-Za-z\d]{8,64}$/;
  return regexPassword.test(password);
};

export const checkFullName = (fullName) => {
  if (typeof fullName !== "string") return false;
  // Fullname between 6 and 64 letters long
  const trimmed = fullName.trim();
  const regexFullName = /^[\p{L} ]{6,64}$/u;
  return !!trimmed && regexFullName.test(trimmed);
};

export const checkEmail = (email) => {
  if (typeof email !== "string") return false;

  const trimmed = email.trim();

  // Kiểm tra tổng độ dài email
  if (trimmed.length < 6 || trimmed.length > 254) return false;

  // Regex kiểm tra định dạng email chuẩn
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Kiểm tra phần tên người dùng không vượt quá 64 ký tự
  const [localPart, domainPart] = trimmed.split("@");
  if (!localPart || !domainPart || localPart.length > 64) return false;

  // Kiểm tra định dạng và độ dài hợp lệ
  return regexEmail.test(trimmed);
};
