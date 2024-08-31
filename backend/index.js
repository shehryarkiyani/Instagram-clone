import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import ConnectionDB from "./database/db.js";
dotenv.config();
const app = express();
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});
ConnectionDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listen to the port ${PORT}`);
});
