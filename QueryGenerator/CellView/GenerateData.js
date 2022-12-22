import { getCellViewParams } from "../GetParams.js";
import { addQuotes } from "../../Utils/CommonFunctions.js";

export const getCellViewDataQuery = ({
  technology,
  mcc,
  mnc,
  user,
  dataType,
  startTime,
  endTime,
  signalStrengthGood,
  signalStrengthBad,
  signalQualityGood,
  signalQualityBad,
  sinrGood,
  sinrBad,
  packages,
}) => {
  if (technology == undefined) return "";
  let query = "";
  let {
    technologyTable,
    rat,
    ci,
    p,
    q,
    a,
    groupByQuery,
    additionalParams3G,
    ecno,
    rscp,
    sinr,
  } = getCellViewParams(technology);
  let tableName = `dataInfo${technologyTable}JsonRunning`;
  let packagesArr = packages.split(",");

  query =
    " select " +
    addQuotes(rat) +
    " rat, cellid ci, " +
    a +
    " area, identity" +
    technologyTable +
    "mnc mnc, identity" +
    technologyTable +
    "mcc mcc, sum(1) nb, ";

  for (let i = 0; i < packagesArr.length; i++) {
    let packageName = packagesArr[i].replace(".", "_");
    query +=
      " round(coalesce(max(case when fpackagename = " +
      addQuotes(packagesArr[i]) +
      " then (fDownDataD*8)/(endtime-starttime) end),'--'),3)" +
      " as '" +
      packageName +
      "-DN', " +
      "round(coalesce(max(case when fpackagename = " +
      addQuotes(packagesArr[i]) +
      " then (fUpDataD*8)/(endtime-starttime) end),'--'),3)" +
      " as '" +
      packageName +
      "-UP',";
  }
  let packageNamesFilter = " AND fpackagename in (";
  for (let i = 0; i < packagesArr.length; i++) {
    packageNamesFilter += "'" + packagesArr[i] + "'";
    if (i < packagesArr.length - 1) {
      packageNamesFilter += ",";
    }
  }
  packageNamesFilter += ") ";

  query +=
    " min(" +
    p +
    ") as smin, " +
    " max(" +
    p +
    ") as smax, " +
    " round(avg(" +
    p +
    ")) as savg," +
    " min(" +
    q +
    ") as qmin, " +
    " max(" +
    q +
    ") as qmax, " +
    " round(avg(" +
    q +
    ")) as qavg " +
    " From " +
    tableName +
    " c " +
    " WHERE c.identity" +
    technologyTable +
    "mcc = " +
    addQuotes(mcc) +
    " AND identity" +
    technologyTable +
    "mnc = " +
    addQuotes(mnc) +
    " AND starttime >= " +
    addQuotes(startTime) +
    " AND starttime <=" +
    addQuotes(endTime) +
    packageNamesFilter;

  if (user != "*") {
    query = query + "AND clientIdg IN (" + stringToSqlIn(user) + ")";
  }

  query = query + " group by ci, area";

  return query;
};
