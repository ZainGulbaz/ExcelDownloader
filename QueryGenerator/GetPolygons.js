import { pool } from "../DatabaseConnection.js";
import logger from "../Logger.js";

const tableName = `polygons`;

const getPolygons = async (mcc, database) => {
  try {
    const polygons = pool.query(
      `SELECT * FROM ${database}.${tableName} WHERE mcc = ${mcc} order by id desc`
    );
    return polygons;
  } catch (err) {
    logger.error("Error in getting the polygons");
    logger.log(err);
  }
};

export default getPolygons;
