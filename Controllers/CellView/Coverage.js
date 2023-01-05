import { pool } from "../../DatabaseConnection.js";
import { getCellViewCoverageQuery } from "../../QueryGenerator/CellView/GenerateCoverage.js";
import excelGenerator from "../../ExcelGenerator.js";
import logger from "../../Logger.js";
import { isResValid } from "../../Utils/CommonFunctions.js";

const getCellViewCoverageData = async (data) => {
  try {
    let query = getCellViewCoverageQuery(data);

    let resData = await pool.query(query);
    if (!(await isResValid(data, resData))) return;
    let columns = Object?.keys(resData?.[0]);
    logger.info(
      "Query to get Coverage records is successfully implemented in getCellViewCoverageData"
    );
    excelGenerator(columns, resData, data?.uuid, data.database);
  } catch (err) {
    logger.error(
      "Query to get Coverage records is failed in getCellViewCoverageData"
    );
    console.log(err);
  }
};

export default getCellViewCoverageData;
