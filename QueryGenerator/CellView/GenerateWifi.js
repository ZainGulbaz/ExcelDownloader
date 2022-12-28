import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";

export const getCellViewWifiQuery = ({
  country,
  dataType,
  startTime,
  endTime,
  packages,
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

  query =
    "select  wifiSSID,avg(wifiLinkSpeed) as wifiLinkSpeed,avg(wifiInfoRssi) as wifiInfoRssi ,max(wifiInfoRssi) as maxWifiInfoRssi,min(wifiInfoRssi) as minWifiInfoRssi,count(*) as nb,";

  for (let i = 0; i < packagesArr.length; i++) {
    query +=
      " round(coalesce(max(case when appPackageName = " +
      addQuotes(packagesArr[i]) +
      " then (dataUsedDown*8)/(appEndTime-appStartTime) end),'--'),3)" +
      " as '" +
      packagesArr[i] +
      "-DN', " +
      "round(coalesce(max(case when appPackageName = " +
      addQuotes(packagesArr[i]) +
      " then (dataUsedUp*8)/(appEndTime-appStartTime) end),'--'),3)" +
      " as '" +
      packagesArr[i] +
      "-UP',";
  }

  query +=
    "avg(wifiInfoFrequency) as avgWifiInfoFrequency From " +
    tableName +
    " wd  WHERE wd.country = " +
    addQuotes(country) +
    " AND appStartTime > " +
    addQuotes(startTime) +
    " AND appStartTime < " +
    addQuotes(endTime) +
    " AND appPackageName in (" +
    packagesQry +
    ")";

    if (!user.equals("*") && !user.equals("")) {
      query = query + "AND clientIdg IN (" + stringToSqlIn(user) + ")";
    }

    query+="GROUP BY wifiSSID"

  return query;
};
