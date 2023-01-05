import getConnection from "./DatabaseConnection.js";
import scheduleFunction from "./Cron.js";
import express from "express";
import cors from "cors";
import downloadRoute from "./Routes/excel.download.route.js";

const PORT=9071;
const expressApp= express();
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(downloadRoute);


expressApp.listen(PORT, () => console.log(`CONNECTED TO PORT: ${PORT}`));

//Database Connection
export const app = async () => {
  await getConnection();
  scheduleFunction();
};
