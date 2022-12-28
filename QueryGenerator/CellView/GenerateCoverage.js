import { getCellViewParams } from "../GetParams.js";
import { addQuotes, stringToSqlIn } from "../../Utils/CommonFunctions.js";

export const getCellViewCoverageQuery = ({
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

  if (technology == "5G" || technology == "4G") {
    query =
      "Select '" +
      rat +
      "' rat,  sum(1) as nb, ci , a as area, min(p) as smin,max(p) as smax,round(avg(p)) as savg,min(q) as qmin ,max(q) as qmax,round(avg(q)) as qavg ,min(sinr) as sinr_min, max(sinr) as sinr_max,round(avg(sinr)) as sinr_avg,round(100 * sum(p >=" +
      signalStrengthGood +
      ") / sum(1), 1) good, round( 100 * sum( p < " +
      signalStrengthGood +
      " and p > " +
      signalStrengthBad +
      " ) / sum(1), 1 ) average, round(100 * sum(p <= " +
      signalStrengthBad +
      ") / sum(1), 1) bad,round(100 * sum(q >=" +
      signalQualityGood +
      ") / sum(1),1) signalQualityGood,round( 100 * sum( q < " +
      signalQualityGood +
      " and q > " +
      signalQualityBad +
      " ) / sum(1), 1 ) averageQ,round(100 * sum(q <= " +
      signalQualityBad +
      ") / sum(1), 1) signalQualityBad,round(100 * sum(sinr >=" +
      sinrGood +
      ") / sum(1),1) sinrGood, round( 100 * sum( sinr < " +
      sinrGood +
      " and sinr > " +
      sinrBad +
      " ) / sum(1), 1 ) averageSinr,round(100 * sum(sinr <= " +
      sinrBad +
      ") / sum(1), 1) sinrBad FROM ( ";
    query +=
      "select " +
      p +
      " as p," +
      q +
      " as q ,if(" +
      sinr +
      "=2147483647,0," +
      sinr +
      ") as sinr,cellid as ci , " +
      a +
      " as a from " +
      tableName;
  } else {
    query =
      "Select '" +
      rat +
      "' rat,  sum(1) as nb, ci , a as area, min(p) as smin,max(p) as smax,round(avg(p)) as savg,min(q) as qmin ,max(q) as qmax,round(avg(q)) as qavg ,round(100 * sum(p >=" +
      signalStrengthGood +
      ") / sum(1), 1) good, round( 100 * sum( p < " +
      signalStrengthGood +
      " and p > " +
      signalStrengthBad +
      " ) / sum(1), 1 ) average, round(100 * sum(p <= " +
      signalStrengthBad +
      ") / sum(1), 1) bad  " +
      additionalParams3G +
      " ,round(100 * sum(q >= " +
      signalQualityGood +
      ") / sum(1), 1) goodQ,round( 100 * sum( q < " +
      signalQualityGood +
      " and q > " +
      signalQualityBad +
      " ) / sum(1), 1 ) averageQ,round(100 * sum(q <= " +
      signalQualityBad +
      ") / sum(1), 1) badQ FROM ( ";

    additionalParams3G = "";
    if (technology == "3G") {
      additionalParams3G = "," + ecno + " as ecno," + rscp + " as rscp";
    }
    query +=
      "select " +
      p +
      " as p, " +
      q +
      " as q , cellid as ci " +
      additionalParams3G +
      "," +
      a +
      " as a from " +
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
    " and starttime >= " +
    addQuotes(startTime) +
    " and starttime <= " +
    addQuotes(endTime);

  if (user != "*") {
    query += ` AND clientIdg IN (${stringToSqlIn(user)})`;
  }

  query += `${groupByQuery}) as abc GROUP BY ci,a`;

  return query;
};
