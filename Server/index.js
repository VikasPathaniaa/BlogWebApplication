import express from "express";
import connection from "./Database/db.js";
import dotenv from "dotenv";
import router from "./Routes/route.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//* dotenv configration for use .env file in nodejs server this is come from npm package
dotenv.config();


app.use("/", router);
const user = process.env.USER_NAME;
const password = process.env.PASSWORD;
connection(user, password);

//* server port 
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is  running on  port number ${PORT} `);
});
