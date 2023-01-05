import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";
import getPolygons from "../GetPolygons.js";

export const getPolygonViewDataQuery = async ({
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
  database,
}) => {
  if (technology == undefined) return "";
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
  let tableName = `${database}.dataInfo${technologyTable}JsonRunning`;
  let packagesArr = packages.split(",");
  let query = "";
  const polygons = await getPolygons(mcc, database);
  for (let i = 0; i < polygons.length; i++) {
    if (i !== 0) query += " UNION ";

    query +=
      " select " +
      addQuotes(rat) +
      " rat, cellid ci,'" +
      polygons[i].id +
      "' as 'poly id','" +
      polygons[i].name +
      "' as name, " +
      mnc +
      " mnc, " +
      mcc +
      " mcc, count(*) nb, ";

    packages = "";
    for (let j = 0; j < packagesArr.length; j++) {
      packages += addQuotes(packagesArr[i]);
      if (j < packagesArr.length - 1) packages += ",";

      let packageName = packagesArr[j].replace(".", "_");
      query +=
        " round(coalesce(max(case when fpackagename = " +
        addQuotes(packagesArr[j]) +
        " then (fDownDataD*8)/(endtime-starttime) end),'--'),3)" +
        " as '" +
        packageName +
        "-DN', " +
        "round(coalesce(max(case when fpackagename = " +
        addQuotes(packagesArr[j]) +
        " then (fUpDataD*8)/(endtime-starttime) end),'--'),3)" +
        " as '" +
        packageName +
        "-UP',";
    }

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
      " WHERE identity" +
      technologyTable +
      "mcc = " +
      addQuotes(mcc) +
      " AND ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
      polygons[i].polygon +
      "))') , POINT( longitude,latitude))" +
      " AND fPackageName IN (" +
      packages +
      ") AND identity" +
      technologyTable +
      "mnc =  " +
      addQuotes(mnc) +
      " AND	starttime >= " +
      addQuotes(startTime) +
      " AND starttime <= " +
      addQuotes(endTime);

    if (!user == "*" && !user == "") {
      query = query + "AND clientIdg IN (" + stringToSqlIn(user) + ")";
    }

    // query += ") a ";
  }
  return query;
};
