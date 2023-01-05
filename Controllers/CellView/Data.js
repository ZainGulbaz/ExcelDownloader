import { pool } from "../../DatabaseConnection.js";
import { getCellViewDataQuery } from "../../QueryGenerator/CellView/GenerateData.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getCellViewDataData = async (data) => {
  try {
    let query = getCellViewDataQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getCellViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error("Query to get Data records is failed in getCellViewDataData");
    console.log(err);
  }
};

export default getCellViewDataData;
