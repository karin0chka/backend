import mongoose from "mongoose";
import config from "../../utils/config";

if (!config.DB.MONGO.URI) throw new Error("URI is not found");

mongoose
  .connect(config.DB.MONGO.URI)
  .then(() => {
    console.log("\nConnected to Mongo🍁\n");
  })
  .catch((e) => {
    console.log(e);
  });
