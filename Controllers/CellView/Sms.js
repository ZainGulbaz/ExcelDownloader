import { pool } from "../../DatabaseConnection.js";
import { getCellViewSmsQuery } from "../../QueryGenerator/CellView/GenerateSms.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getCellViewSmsData = async (data) => {
  try {
    let query = getCellViewSmsQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getCellViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error("Query to get Sms records is failed in getCellViewSmsData");
    console.log(err);
  }
};

export default getCellViewSmsData;
