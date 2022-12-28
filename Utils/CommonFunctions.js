import { pool } from "../DatabaseConnection.js";
import logger from "../Logger.js";
import "dotenv/config";

export const addQuotes = (str) => `'${str}'`;

const enums = Object.freeze({
  excelGenerator: "excel_generator",
});

const { databaseLike } = JSON.parse(process.env[process.env.NODE_ENV]);

export const convertUnixToDate = (unixTime) => {
  const date = new Date(unixTime);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day}-${month}-${year}`;
};

export const getMccfromIso = async (iso) => {
  try {
    let mccData = await pool.query(
      `SELECT mcc from mccData where iso=${iso} Limit 1`
    );
    return mccData[0].mcc;
  } catch (err) {
    logger.error("Error in getting mcc from iso");
    console.log(err);
  }
};

export const getDatabases = async () => {
  try {
    let databases = await pool.query(
      `SELECT DISTINCT(TABLE_SCHEMA) as databaseName FROM information_schema.TABLES WHERE TABLE_SCHEMA like ${addQuotes(
        databaseLike + "%"
      )} AND TABLE_SCHEMA !='mycemCommons'`
    );
    return databases;
  } catch (err) {
    logger.error("Error getting databases");
    console.log(err);
  }
};

export const stringToSqlIn = (str) => {
  let strArr = str.split(",");
  str = "";
  strArr?.map((element) => (str += `'${element}',`));
  return str.slice(0, str.length - 1);
};

export async function isResValid(data, resData) {
  try {
    if (resData.length == 0) {
      logger.info("No records found for respective request");
      console.log(data);
      let res = await pool.query(
        `DELETE FROM ${enums.excelGenerator} WHERE id=${data.id}`
      );
      return false;
    }
    return true;
  } catch (err) {
    logger.error("Error in checking validity of request");
    console.log(err);
  }
}
