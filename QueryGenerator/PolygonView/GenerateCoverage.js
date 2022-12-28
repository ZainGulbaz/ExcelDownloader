import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";
import getPolygons from "../GetPolygons.js";

export const getPolygonViewCoverageQuery = async ({
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
  let tableName = `${database}.cellInfo${technologyTable}Json`;
  if (additionalParams3G == undefined) additionalParams3G = "";
  let query = "";
  groupByQuery = groupByQuery.replace("ci", "cellid");
  const polygons = await getPolygons(mcc);

  for (let i = 0; i < polygons.length; i++) {
    if (i !== 0) query += " UNION ";
    if (technology == "5g" || technology == "lte") {
      query +=
        "Select '" +
        rat +
        "' rat, '" +
        polygons[i].name +
        "' as name , sum(1) as nb, " +
        polygons[i].id +
        " as ci, min(p) as smin,max(p) as smax,round(avg(p)) as savg,min(q) as qmin ,max(q) as qmax,round(avg(q)) as qavg ,min(sinr) as sinr_min,max(sinr) as sinr_max,round(avg(sinr)) as sinr_avg,round(100 * sum(p >= " +
        signalStrengthGood +
        ") / sum(1), 1) good, round( 100 * sum( p < " +
        signalStrengthGood +
        " and p > " +
        signalStrengthBad +
        " ) / sum(1), 1 ) average, round(100 * sum(p <= " +
        signalStrengthBad +
        ") / sum(1), 1) bad FROM ( ";
      query +=
        "select " +
        p +
        " as p, " +
        q +
        " as q, if(" +
        sinr +
        "=2147483647,0," +
        sinr +
        ") as sinr , ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
        polygons[i].polygon +
        "))') , POINT( longitude,latitude)) st from " +
        tableName;
    } else {
      query +=
        "Select '" +
        rat +
        "' rat, '" +
        polygons[i].name +
        "' as name , sum(1) as nb, " +
        polygons[i].id +
        " as ci, min(p) as smin,max(p) as smax,round(avg(p)) as savg,min(q) as qmin ,max(q) as qmax,round(avg(q)) as qavg ,round(100 * sum(p >=" +
        signalStrengthGood +
        ") / sum(1), 1) good, round( 100 * sum( p < " +
        signalStrengthGood +
        " and p > " +
        signalStrengthBad +
        " ) / sum(1), 1 ) average, round(100 * sum(p <= " +
        signalStrengthBad +
        ") / sum(1), 1) bad " +
        " FROM ( ";
      query +=
        "select " +
        p +
        " as p, " +
        q +
        " as q  , ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
        polygons[i].polygon +
        "))') , POINT( longitude,latitude)) st from " +
        tableName;
    }

    query +=
      " WHERE identity" +
      technologyTable +
      "mcc = " +
      addQuotes(mcc) +
      " AND identity" +
      technologyTable +
      "mnc = " +
      addQuotes(mnc) +
      " and starttime >=" +
      addQuotes(startTime) +
      " and starttime <= " +
      addQuotes(endTime) +
      " " +
      groupByQuery;

    if (!user == "*" && !user == "") {
      if (dataType == "cell") {
        query += " AND clientIdg IN(" + stringToSqlIn(user) + ")";
      }
    }

    query +=
      ") as abc where st >0 and p < 1000 and q < 1000 and st IS NOT NULL ";
  }

  return query;
};
