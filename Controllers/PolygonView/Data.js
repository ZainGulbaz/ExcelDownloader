import { pool } from "../../DatabaseConnection.js";
import { getPolygonViewDataQuery } from "../../QueryGenerator/PolygonView/GenerateData.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getPolygonViewDataData = async (data) => {
  try {
    let query = await getPolygonViewDataQuery(data);
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

export default getPolygonViewDataData;
