import { pool } from "../../DatabaseConnection.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { getPolygonViewCallQuery } from "../../QueryGenerator/PolygonView/GenerateCalls.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getPolygonViewCallData = async (data) => {
  try {
    let query = await getPolygonViewCallQuery(data);
    console.log(query);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Call records is successfully implemented in getPolygonViewCallData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error("Error in getPolygonViewCallData Function");
    console.log(err);
  }
};

export default getPolygonViewCallData;
