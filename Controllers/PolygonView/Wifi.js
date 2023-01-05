import { pool } from "../../DatabaseConnection.js";
import { getPolygonViewWifiQuery } from "../../QueryGenerator/PolygonView/GenerateWifi.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getPolygonViewWifiData = async (data) => {
  try {
    let mccDataRes = await pool.query(
      `SELECT iso FROM mccData WHERE MCC=${data.mcc} Limit 1`
    );
    data.country = mccDataRes?.[0].iso;
    let query = await getPolygonViewWifiQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getPolygonViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error(
      "Query to get Wifi records is failed in getPolygonViewWifiData"
    );
    console.log(err);
  }
};

export default getPolygonViewWifiData;
