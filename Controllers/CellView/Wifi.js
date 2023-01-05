import { pool } from "../../DatabaseConnection.js";
import { getCellViewWifiQuery } from "../../QueryGenerator/CellView/GenerateWifi.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getCellViewWifiData = async (data) => {
  try {
    let mccDataRes = await pool.query(
      `SELECT iso FROM mccData WHERE MCC=${data.mcc} Limit 1`
    );
    data.country = mccDataRes?.[0].iso;
    let query = getCellViewWifiQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getCellViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error("Query to get Wifi records is failed in getCellViewWifiData");
    console.log(err);
  }
};

export default getCellViewWifiData;
