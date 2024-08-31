import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectionDB = () => {
  const USERNAME = process.env.DB_USERNAME;
  const PASSWORD = process.env.DB_PASSWORD;
  const DBName = process.env.DB_NAME;

  const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.p4zfi.mongodb.net/${DBName}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

    mongoose.connection.on("connected", () => {
      console.log("Database connected Successfully");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
    mongoose.connection.on("error", (error) => {
      console.log("Error while connecting with the database ", error.message);
    });
  } catch (err) {
    console.log("error while connecting DB", err.message, MONGODB_URI);
  }
};
export default ConnectionDB;
