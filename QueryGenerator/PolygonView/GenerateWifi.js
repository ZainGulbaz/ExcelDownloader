import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";
import getPolygons from "../GetPolygons.js";

export const getPolygonViewWifiQuery = async ({
  country,
  dataType,
  startTime,
  endTime,
  packages,
  mcc,
  database,
}) => {
  let query = "";
  let tableName = `${database}.wifiData`;
  let packagesArr = packages.split(",");

  let packagesQry = "";

  for (let i = 0; i < packagesArr.length; i++) {
    packagesQry += "'" + packagesArr[i] + "',";
  }
  packagesQry = packagesQry.substring(0, packagesQry.length - 1);
  const polygons = await getPolygons(mcc);
  for (let i = 0; i < polygons.length; i++) {
    if (i !== 0) query += " UNION ";
    query +=
      " select " +
      polygons[i].id +
      " as polyid,'" +
      polygons[i].name +
      "' as name, count(*) nb, wifiSSID,avg(wifiLinkSpeed) as wifiLinkSpeed,avg(wifiInfoRssi) as wifiInfoRssi ,max(wifiInfoRssi) as maxWifiInfoRssi,min(wifiInfoRssi) as minWifiInfoRssi,";

    packages = "";
    for (let j = 0; j < packagesArr.length; j++) {
      let packageName = packagesArr[j].replace(".", "_");
      packages += addQuotes(packagesArr[j]);
      if (j !== packagesArr.length - 1) packages += ",";

      query +=
        " round(coalesce(max(case when appPackageName = " +
        addQuotes(packagesArr[j]) +
        " then (dataUsedDown*8)/(appEndTime-appStartTime) end),'--'),3)" +
        " as '" +
        packageName +
        "-DN', " +
        "round(coalesce(max(case when appPackageName = " +
        addQuotes(packagesArr[j]) +
        " then (dataUsedUp*8)/(appEndTime-appStartTime) end),'--'),3)" +
        " as '" +
        packageName +
        "-UP',";
    }

    query +=
      " avg(wifiInfoFrequency) as avgWifiInfoFrequency FROM " +
      tableName +
      " WHERE ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
      polygons[i].polygon +
      "))') , POINT( longitude,latitude))" +
      " AND appPackageName IN (" +
      packages +
      ") AND	appStartTime >= " +
      addQuotes(startTime) +
      " AND appStartTime <=" +
      addQuotes(endTime);

    if (!user.equals("*") && !user.equals("")) {
      query = query + "AND clientIdg IN (" + stringToSqlIn(user) + ")";
    }
  }
  return query;
};
