import express from "express";
import "dotenv/config";
import getConnection from "./DatabaseConnection.js";
import getExcel from "./Controllers/index.js";
import scheduleFunction from "./Cron.js";

const app = express();

//middlewares
app.use(express.json());

//Database Connection
getConnection();

scheduleFunction();

app.get("/", async (req, res) => {
  await getExcel();
  res.status(200).json({ message: "The API has hit" });
});

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
