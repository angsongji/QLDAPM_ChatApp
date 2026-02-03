export const passwordRequire = [
  {
    id: 0,
    title: "8–64 characters long",
  },
  {
    id: 1,
    title: "At least 1 uppercase letter",
  },
  {
    id: 2,
    title: "At least 1 digit",
  },
  {
    id: 3,
    title: "No spaces, no special characters",
  },
];
export const checkPassword = (password, id) => {
  // pair // means a regex expression
  // Password can't include space, special characters
  // Password between 8-64 characters
  // Password at least 1 uppercase character
  // Password at least 1 digit
  if (typeof password !== "string") return false;
  const regexMap = {
    0: /^.{8,64}$/,
    1: /[A-Z]/,
    2: /\d/,
    3: /^(?!.*[\W\s]).{1,64}$/,
  };

  const regex = regexMap[id];
  return regex ? regex.test(password) : false;
};
