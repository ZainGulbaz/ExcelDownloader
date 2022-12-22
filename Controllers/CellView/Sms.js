import { pool } from "../../DatabaseConnection.js";
import { getCellViewSmsQuery } from "../../QueryGenerator/CellView/GenerateSms.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";

const getCellViewSmsData = async (data) => {
  try {
    let query = getCellViewSmsQuery(data);
    let resData = await pool.query(query);
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getCellViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid);
  } catch (err) {
    logger.error("Query to get Sms records is failed in getCellViewSmsData");
    console.log(err);
  }
};

export default getCellViewSmsData;
