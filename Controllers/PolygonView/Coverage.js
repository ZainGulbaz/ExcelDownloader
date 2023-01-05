import { pool } from "../../DatabaseConnection.js";
import { getPolygonViewCoverageQuery } from "../../QueryGenerator/PolygonView/GenerateCoverage.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getPolygonViewCoverageData = async (data) => {
  try {
    let query = await getPolygonViewCoverageQuery(data);
    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Coverage records is successfully implemented in getPolygonViewCoverageData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error(
      "Query to get Coverage records is failed in getPolygonViewCoverageData"
    );
    console.log(err);
  }
};

export default getPolygonViewCoverageData;
