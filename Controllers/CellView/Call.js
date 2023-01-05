import { pool } from "../../DatabaseConnection.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { getCellViewCallQuery } from "../../QueryGenerator/CellView/GenerateCall.js";
import { isResValid } from "../../Utils/CommonFunctions.js";
const getCellViewCallData = async (data) => {
  try {
    let query = getCellViewCallQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Call records is successfully implemented in getCellViewCallData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error("Error in getCellViewCallData Function");
    console.log(err);
  }
};

export default getCellViewCallData;
