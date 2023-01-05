import xl from "excel4node";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { pool } from "./DatabaseConnection.js";
import logger from "./Logger.js";
import { addQuotes } from "./Utils/CommonFunctions.js";

const excelGenerator = async (headingColumnNames, data, uuid, database) => {
  try {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Mycemsheet");

    let headingColumnIndex = 1;
    headingColumnNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    // Write Data in Excel file
    let rowIndex = 2;
    data.forEach((record) => {
      let columnIndex = 1;
      Object.keys(record).forEach((columnName) => {
        ws.cell(rowIndex, columnIndex++).string(record[columnName] + "");
      });
      rowIndex++;
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    wb.write(`${__dirname}/Downloads/${uuid}.xlsx`);
    await pool.query(
      `UPDATE ${database}.excel_generator SET downloaded=1 WHERE uuid=${addQuotes(
        uuid
      )}`
    );

    logger.info(
      `${uuid}.xlsx is successfully Generated and Saved to ${__dirname}/Downloads`
    );
  } catch (err) {
    logger.error("Unable to generate the excel file");
    console.log(err);
  }
};

export default excelGenerator;
