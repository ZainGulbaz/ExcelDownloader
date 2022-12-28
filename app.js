import getConnection from "./DatabaseConnection.js";
import scheduleFunction from "./Cron.js";

//Database Connection
const app = async () => {
  await getConnection();
  scheduleFunction();
};

export default app;
