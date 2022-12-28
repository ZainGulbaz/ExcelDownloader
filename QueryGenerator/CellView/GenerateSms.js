import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";

export const getCellViewSmsQuery = ({
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

  query +=
    "Select '" +
    rat +
    "' rat, sum(1) as nb, ci , a as area, sum(sin) as smsin, sum(sout) as smsout, coalesce(round( 100 * sum( indeltime ) / sum(vin)),0 ) smsinDeltime,  min(p) as smin,max(p) as smax,round(avg(p)) as savg,min(q) as qmin ,max(q) as qmax,round(avg(q)) as qavg ,round(100 * sum(p >= -90) / sum(1), 1) good, round( 100 * sum( p < -90 and p > -110 ) / sum(1), 1 ) average, round(100 * sum(p <= -110) / sum(1), 1) bad FROM ( ";
  query +=
    "select " +
    p +
    " as p, " +
    q +
    " as q , cellid as ci , " +
    a +
    " as a, coalesce(type='IN',0) as sin, type='IN' as vin,coalesce(type='OUT',0) as sout, (type = 'IN' and (datereceived - datesent) < 20000) as indeltime from " +
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
    " AND starttime >=" +
    addQuotes(startTime) +
    " AND starttime <= " +
    addQuotes(endTime);

  if (!user == "*" && user == "" && everythingOkay) {
    query += " AND clientIdg IN (" + stringToSqlIn(user) + ")";
  }

  query +=
    " GROUP BY datereceived , datesent , clientIdg ) as abc GROUP BY ci,a";

  return query;
};
