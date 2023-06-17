import mongoose from "mongoose";

const connection = async (user, password) => {
  // database url

  const URL = `mongodb://${user}:${password}@ac-c0aaey3-shard-00-00.bgw5ljp.mongodb.net:27017,ac-c0aaey3-shard-00-01.bgw5ljp.mongodb.net:27017,ac-c0aaey3-shard-00-02.bgw5ljp.mongodb.net:27017/?ssl=true&replicaSet=atlas-kgj6bp-shard-0&authSource=admin&retryWrites=true&w=majority`;
  mongoose.set("strictQuery", false);

  // mongoose connection block 
  try {
    await mongoose.connect(URL, { useNewUrlParser: true });
    console.log("database connected Succesfully  ");
  } catch (error) {
    console.log("error during database connectivity ", error);
  }
};

export default connection;
