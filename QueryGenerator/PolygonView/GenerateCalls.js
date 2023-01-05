import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";
import getPolygons from "../GetPolygons.js";

export const getPolygonViewCallQuery = async ({
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
  let query = "",
    subQuery = "",
    joinnedQuery = "";
  let { technologyTable, rat, ci, p, q, a } = getCellViewParams(technology);
  let tableName = `${database}.callInfo${technologyTable}Json`;

  const polygons = await getPolygons(mcc, database);
  for (let i = 0; i < polygons.length; i++) {
    if (i !== 0) joinnedQuery += " UNION ";
    query =
      "Select '" +
      rat +
      "' rat, " +
      polygons[i].id +
      " as ci,  '" +
      polygons[i].name +
      "' as name," +
      " sum(cin) as callin,sum(cout) as callout, count(1) as NB ,COALESCE (round(100 * sum( sr1 )/ sum( sr2 )),'--' ) as setupRing," +
      " COALESCE ( round( 100 * sum( ddout )/ sum( dout )), 0 ) shortOut, " +
      " COALESCE ( round( 100 * sum( ddin )/ sum( din )), 0 ) shortIn, " +
      " round((COALESCE ( round( 100 * sum( ddout )/ sum( dout )), 0 ) + COALESCE ( round( 100 * sum( ddin )/ sum( din )), 0 ))/2) AS short, " +
      " min(p) as smin,max(p) as smax,round(avg(p)) as savg, min(q) as qmin ," +
      " max(q) as qmax,round(avg(q)) as qavg  FROM ( ";

    query +=
      "select " +
      p +
      " as p,  " +
      q +
      " as q, COALESCE ( direction = 'in', 0 ) as cin, " +
      " COALESCE ( direction = 'out', 0 ) as cout , direction = 'out' AND duration < 10000 as ddout," +
      " direction = 'in' AND duration < 10000 as ddin, direction = 'out' as dout," +
      " direction = 'out' AND connectedTimeStamp > startTime AND ( connectedTimeStamp - startTime ) < 20000 as sr1," +
      " duration < 10000 as dshort, direction = 'out' AND connectedTimeStamp > startTime as sr2," +
      " direction = 'in' as din, ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
      polygons[i].polygon +
      "))') , POINT( longitude,latitude)) st " +
      " from " +
      tableName;

    subQuery =
      " SELECT " +
      polygons[i].id +
      " AS ci, round(avg(callsetuptime)) as callSetupTime FROM ( " +
      "  SELECT ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
      polygons[i].polygon +
      "))') , POINT( longitude,latitude)) st, " +
      "  IF(callstarttime>0 && connectedtimestamp>0,TIMESTAMPDIFF(SECOND,FROM_UNIXTIME(Floor(callstarttime/1000)),FROM_UNIXTIME(Floor(connectedtimestamp/1000))),0) " +
      "  as callSetupTime FROM " +
      tableName;

    let queryFilter =
      " WHERE identity" +
      technologyTable +
      "mcc = " +
      addQuotes(mcc) +
      " AND identity" +
      technologyTable +
      "mnc = " +
      addQuotes(mnc) +
      " AND starttime >= " +
      addQuotes(startTime) +
      " AND starttime <= " +
      addQuotes(endTime);
    query += queryFilter;
    subQuery += queryFilter;

    if (!user == "*" && !user == "") {
      if (dataType == "call") {
        query += " AND clientIdg IN(" + stringToSqlIn(user) + ")";
        subQuery += " AND clientIdg IN(" + stringToSqlIn(user) + ")";
      }
    }

    query += ") as abc WHERE st >0 and st IS NOT NULL ";
    subQuery += ") as abc WHERE st >0 and st IS NOT NULL AND callSetupTime > 0";

    joinnedQuery +=
      " SELECT a.*,b.callSetupTime FROM (" +
      query +
      ") as a left join (" +
      subQuery +
      ") as b " +
      " ON a.ci = b.ci ";
  }
  return joinnedQuery;
};
