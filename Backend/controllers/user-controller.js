const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "MyKey";

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login instead" });
  }

  //   const hashedPassword = bcrypt.hashSync(password,12);
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return new Error(error);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup please" });
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
    expiresIn: "35s",
  });
  console.log("TOKEN IS");
  console.log(token);

  console.log("GENERATED TOKEN\n", token);

  if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60),
    httpOnly: true,
    SameSite: "lax",
  });
  console.log("COKKKOESSS");
  console.log(res.cookie);
  return res
    .status(200)
    .json({ message: "Successfully login", user: existingUser, token });
};

const verifyToken = (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    console.log("COOOOKIIIIIIISSSSS");
    console.log(cookies);
    let token = cookies.split("=")[1];
    console.log("TOOOKKEEEEENNNN");
    console.log(token);
    const headers = req.headers[`authorization`];
    console.log("LOG HEADERS");
    console.log(headers);
    // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjdhNjg0MTcyZWE5OTE5ZDBmZDFjMiIsImlhdCI6MTY3NzMzOTY3NSwiZXhwIjoxNjc3MzQzMjc1fQ.WvuSln4kPrUEecePTVZwhfZWjYeiYA3jbDM2qOnu_MI';
    // const token = headers.split(" ")[1];
    if (!token) {
      res.status(404).json({ message: "No token found" });
    }
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log("IMAN ERRORRRR");
        console.log(err);
        return res.status(400).json({ message: "Invalid token" });
      }
      console.log(user.id);
      req.id = user.id;
    });
    next();
  } catch (error) {
    console.log("Something happened! 🤔", error);
  }
};

const getUser = async (req, res, next) => {
  console.log("ERRRRRROOOORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR1");

  const userId = req.id;
  let user;
  try {
    console.log("ERRRRRROOOORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR2");

    user = await User.findById(userId, "-password");
  } catch (error) {
    console.log("ERRRRRROOOORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR3");
    return new Error(error);
  }
  if (!user) {
    console.log("ERRRRRROOOORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR4");

    return res.status(404).json({ message: "User not found" });
  }
  console.log("ERRRRRROOOORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR5");

  return res.status(200).json({ user: user });
};

const refreshToken = (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    let prevToken = cookies.split("=")[1];
    if (!prevToken) {
      return res.status(400).json({ message: "Couldn't find token" });
    }

    jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication failed" });
      }
      res.clearCookie(`${user.id}`);
      req.cookies[`${user.id}`] = "";

      const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
        expiresIn: "35s",
      });

      console.log("REGENERATED TOKEN\n", token);

      res.cookie(String(user.id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        SameSite: "lax",
      });

      req.id = user.id;
      next();
    });
  } catch (error) {
    console.log("Something happened! 🤔", error);
  }
};

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: " Couldn't find token" });
  }
  jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.refreshToken = refreshToken;

exports.getUser = getUser;
