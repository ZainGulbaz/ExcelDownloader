import CronJob from "node-cron";
import getExcel from "./Controllers/index.js";
import { getDatabases } from "./Utils/CommonFunctions.js";

const scheduleFunction = () => {
  const scheduledJobFunction = CronJob.schedule("*/1 * * * *", async () => {
    let databases = await getDatabases();

    for (let i = 0; i < databases.length; i++) {
      let database = databases[i];
      await getExcel(database.databaseName);
    }
  });

  scheduledJobFunction.start();
};

export default scheduleFunction;
