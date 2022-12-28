import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";

export const getCellViewCallQuery = ({
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
    subQuery = "";
  let { technologyTable, rat, ci, p, q, a } = getCellViewParams(technology);
  let tableName = `${database}.callInfo${technologyTable}Json`;

  query +=
    "Select '" +
    rat +
    "' rat, sum(1) as nb, ci , a as area, " +
    //" COALESCE ( round( 100 * sum( dshort )/ sum( 1 )), 0 ) short , "+
    " sum(cin) as callin,sum(cout) as callout, COALESCE (round(100 * sum( sr1 )/ sum( sr2 )),'--' ) as setupRing, " +
    " COALESCE ( round( 100 * sum( ddout )/ sum( dout )), 0 ) shortOut, " +
    " COALESCE ( round( 100 * sum( ddin )/ sum( din )), 0 ) shortIn, " +
    " round((COALESCE ( round( 100 * sum( ddout )/ sum( dout )), 0 )+COALESCE ( round( 100 * sum( ddin )/ sum( din )), 0 ))/2) AS short, " +
    " min(p) as smin, max(p) as smax, round(avg(p)) as savg, min(q) as qmin ," +
    " max(q) as qmax,round(avg(q)) as qavg  FROM ( ";
  query +=
    "select " +
    p +
    " as p, " +
    q +
    " as q, cellid as ci , " +
    a +
    " as a," +
    "  COALESCE ( direction = 'in', 0 ) as cin, COALESCE ( direction = 'out', 0 ) as cout " +
    " , direction = 'out' AND duration < 10000 as ddout, direction = 'in' AND duration < 10000 as ddin, " +
    " direction = 'out' as dout, direction = 'out' AND connectedTimeStamp > startTime AND ( connectedTimeStamp - startTime ) < 20000 as sr1, " +
    " duration < 10000 as dshort, direction = 'out' AND connectedTimeStamp > startTime as sr2, direction = 'in' as din " +
    " from " +
    tableName;

  subQuery =
    " SELECT ci, a AS area, round(avg(callSetupTime)) as callSetupTime " +
    " FROM ( " +
    "   SELECT cellid AS ci, " +
    a +
    " AS a, " +
    "   IF(callstarttime>0 && connectedtimestamp>0,TIMESTAMPDIFF(SECOND,FROM_UNIXTIME(Floor(callstarttime/1000)),FROM_UNIXTIME(Floor(connectedtimestamp/1000))),0) " +
    " as callSetupTime	FROM " +
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
    " AND starttime <=" +
    addQuotes(endTime);
  query += queryFilter;
  subQuery += queryFilter;
  subQuery += " AND connectedtimestamp != 0 ";

  if (user !== "*") {
    query +=
      " AND id IN( select id from calls where clientIdg IN(" +
      stringToSqlIn(user) +
      "))";
    subQuery +=
      " AND id IN( select id from calls where clientIdg IN(" +
      stringToSqlIn(user) +
      "))";
  }

  query += " ) as abc GROUP BY ci,a ";
  subQuery += " ) as abc GROUP BY ci,a ";

  let joinnedQuery =
    " SELECT a.*,b.callSetupTime FROM (" +
    query +
    ") as a left join (" +
    subQuery +
    ") as b " +
    " ON a.ci = b.ci and a.area = b.area";

  return joinnedQuery;
};
