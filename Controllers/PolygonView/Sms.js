import { pool } from "../../DatabaseConnection.js";
import { getPolygonViewSmsQuery } from "../../QueryGenerator/PolygonView/GenerateSms.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getPolygonViewSmsData = async (data) => {
  try {
    let query = await getPolygonViewSmsQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Sms records is successfully implemented in getPolygonViewSmsData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error("Query to get Sms records is failed in getPolygonViewSmsData");
    console.log(err);
  }
};

export default getPolygonViewSmsData;
