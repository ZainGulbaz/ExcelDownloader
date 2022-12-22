import { pool } from "../../DatabaseConnection.js";
import { getCellViewDataQuery } from "../../QueryGenerator/CellView/GenerateData.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";

const getCellViewDataData = async (data) => {
  try {
    let query = getCellViewDataQuery(data);
    console.log(query);
    let resData = await pool.query(query);
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getCellViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid);
  } catch (err) {
    logger.error("Query to get Data records is failed in getCellViewDataData");
    console.log(err);
  }
};

export default getCellViewDataData;
