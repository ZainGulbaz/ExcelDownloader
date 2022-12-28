import { pool } from "../DatabaseConnection.js";
import getCellViewCoverageData from "./CellView/Coverage.js";
import getCellViewCallData from "./CellView/Call.js";
import getCellViewSmsData from "./CellView/Sms.js";
import getCellViewDataData from "./CellView/Data.js";
import getCellViewWifiData from "./CellView/Wifi.js";
import getPolygonViewCoverageData from "./PolygonView/Coverage.js";
import getPolygonViewCallData from "./PolygonView/Call.js";
import getPolygonViewSmsData from "./PolygonView/Sms.js";
import getPolygonViewDataData from "./PolygonView/Data.js";
import getPolygonViewWifiData from "./PolygonView/Wifi.js";
import logger from "../Logger.js";

const functionsMapping = Object.freeze({
  cellviewcell: getCellViewCoverageData,
  cellviewcall: getCellViewCallData,
  cellviewsms: getCellViewSmsData,
  cellviewdata: getCellViewDataData,
  cellviewwifi: getCellViewWifiData,
  polygonviewcell: getPolygonViewCoverageData,
  polygonviewcall: getPolygonViewCallData,
  polygonviewsms: getPolygonViewSmsData,
  polygonviewdata: getPolygonViewDataData,
  polygonviewwifi: getPolygonViewWifiData,
});

const getExcel = async (database) => {
  try {
    const tableName = `${database}.excel_generator`;
    let query = `SELECT * FROM ${tableName} WHERE downloaded=0`;
    let res = await pool.query(query);

    if (res?.length == 0) {
      logger.warn("No Downloads Requests are pending");
      return;
    }

    res?.map(async (downloadReq) => {
      try {
        let func = downloadReq?.view + "view" + downloadReq?.dataType;
        downloadReq.database = database;
        await functionsMapping[func](downloadReq);
      } catch (e) {
        logger.error(
          `Unable to find required function for ${downloadReq.dataType} in Controller/Index.js`
        );
        console.log(e);
      }
    });
  } catch (e) {
    logger.error("Error in getExcel() Function ");
    console.log(e);
  }
};

export default getExcel;
