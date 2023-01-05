import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";
import getPolygons from "../GetPolygons.js";

export const getPolygonViewSmsQuery = async ({
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
  let query = "";
  let { technologyTable, rat, ci, p, q, a } = getCellViewParams(technology);
  let tableName = `${database}.smsInfo${technologyTable}Json`;

  const polygons = await getPolygons(mcc, database);

  for (let i = 0; i < polygons.length; i++) {
    if (i !== 0) query += " UNION ";

    query +=
      "Select '" +
      rat +
      "' rat, " +
      polygons[i].id +
      " as ci, '" +
      polygons[i].name +
      "' as name, count(1) as nb, sum(sin) as smsin, sum(sout) as smsout, coalesce(round( 100 * sum( indeltime ) / sum(vin)),0 ) smsinDeltime,  min(p) as smin,max(p) as smax,round(avg(p)) as savg,min(q) as qmin ,max(q) as qmax,round(avg(q)) as qavg ,round(100 * sum(p >= " +
      signalStrengthGood +
      ") / sum(1), 1) good, round( 100 * sum( p <" +
      signalStrengthGood +
      " and p > " +
      signalStrengthBad +
      " ) / sum(1), 1 ) average, round(100 * sum(p <= " +
      signalStrengthBad +
      ") / sum(1), 1) bad FROM ( ";
    query +=
      "select " +
      p +
      " as p, coalesce(type='IN',0) as sin, type='IN' as vin,coalesce(type='OUT',0) as sout, (type = 'IN' and (datereceived - datesent) < 20000) as indeltime, " +
      q +
      " as q,  ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON ((" +
      polygons[i].polygon +
      "))') , POINT( longitude,latitude)) st from " +
      tableName;

    query +=
      " WHERE identity" +
      technologyTable +
      "mcc = " +
      addQuotes(mcc) +
      " AND identity" +
      technologyTable +
      "mnc = " +
      addQuotes(mnc) +
      " and starttime >= " +
      addQuotes(startTime) +
      " AND starttime <= " +
      addQuotes(endTime);
    if (!user == "*" && !user == "") {
      query += " AND clientIdg IN(" + stringToSqlIn(user) + ")";
    }

    query +=
      " GROUP BY datereceived , datesent , clientIdg ) as abc where st >0 and st IS NOT NULL ";
  }
  return query;
};
