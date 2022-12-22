import CronJob from "node-cron";
import getExcel from "./Controllers/index.js";

const scheduleFunction = () => {
  const scheduledJobFunction = CronJob.schedule("*/1 * * * *", async () => {
    await getExcel();
  });

  scheduledJobFunction.start();
};

export default scheduleFunction;
