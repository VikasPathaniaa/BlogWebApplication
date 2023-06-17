import bcrypt from "bcrypt";
import user from "../model/schema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import token from "../model/token.js";

dotenv.config();

export const signUpUser = async (request, response) => {
  try {
    //* now below varible salt line of code is optional instead of we pass second argument 10 in bcrypt.hash() function which create hashed password
    // const salt = await bcrypt.genSalt();
    const hashhedpassword = await bcrypt.hash(request.body.password, 10);

    //* userObject
    const userData = {
      name: request.body.name,
      email: request.body.email,
      password: hashhedpassword,
    };

    // const userData = request.body;
    const newUser = new user(userData);

    //* save userObject in mongo db with save()method
    await newUser.save();
    return response.status(200).json({ msg: " user sign up  successfully " });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: " Error while sign up" });
  }
};

// login user api

export const loginUser = async (request, response) => {
  //* user.findOne() method user come from userControler
  console.log("*******", request.body.userEmail);
  let matchedUser = await user.findOne({ email: request.body.userEmail });
  console.log(matchedUser, "matchedUser");
  if (!matchedUser) {
    return response
      .status(400)
      .json({ msg: "user doesn't match with this email" });
  }
  try {
    let match = await bcrypt.compare(
      request.body.userPassword,
      matchedUser.password
    );

    if (match) {
      console.log(match, "password");
      let accessToken = jwt.sign(
        matchedUser.toJSON(),
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );
      let refreshToken = jwt.sign(
        matchedUser.toJSON(),
        process.env.REFRESH_SECRET_KEY
      );
      console.log(accessToken, "password", refreshToken);
      let newToken = new token({ token: refreshToken });

      //* refreshToken is save in database with .save() method  for hit next access token
      await newToken.save();

      return response.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: matchedUser.name,
        email: matchedUser.email,
      });
    }

    return response.status(400).json({ msg: "your password doesn't match" });
  } catch (error) {
    return response.status(500).json({ msg: "error while login in user " });
  }
};
