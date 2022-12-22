export const getCellViewParams = (technologyType) => {
  if (technologyType == "2G") {
    return {
      technologyTable: "Gsm",
      technology: "gsm",
      rat: "2G",
      ci: "identitygsmmcid",
      p: "signalstrengthgsmmdbm",
      q: "signalstrengthgsmmlevel",
      a: "identitygsmmlac",
      groupByQuery:
        " group by ci,identitygsmmlac,identitygsmmcc,identitygsmmnc,starttime,clientIdg,latitude,longitude,signalstrengthgsmmdbm,signalstrengthgsmmlevel ",
    };
  }
  if (technologyType == "3G") {
    return {
      technologyTable: "Wcdma",
      technology: "wcdma",
      rat: "3G",
      ci: "identitywcdmamcid",
      p: "signalstrengthwcdmamsignalstrength",
      q: "signalstrengthwcdmamasulevel",
      a: "identitywcdmamlac",
      ecno: "signalstrengthwcdmamecno",
      rscp: "signalstrengthwcdmamrscp",

      additionalParams3G:
        ",max(ecno) as ecnoMax ,min(ecno) as ecnoMin,avg(ecno) as ecnoAvg,max(rscp) as rscpMax ,min(rscp) as rscpMin,avg(rscp) as rscpAvg",

      groupByQuery:
        " group by ci,identityWcdmaMlac,identitywcdmamcc,identitywcdmamnc,starttime,clientIdg,latitude,longitude,signalStrengthWcdmaMsignalStrength,signalStrengthWcdmaMasuLevel ",
    };
  }
  if (technologyType == "4G") {
    return {
      technologyTable: "Lte",
      technology: "lte",
      rat: "4G",
      ci: "identityltemci",
      p: "signalstrengthltemrsrp",
      q: "signalstrengthltemrsrq",
      a: "identityltemtac",
      sinr: "signalstrengthltemrssnr",
      groupByQuery:
        " group by ci,identityltemtac,identityltemcc,identityltemnc,starttime,clientIdg,latitude,longitude,signalstrengthltemrsrp,signalstrengthltemrsrq ",
    };
  }
  if (technologyType == "5G") {
    return {
      technologyTable: "5G",
      technology: "5g",
      rat: "5G",
      ci: "identity5gnci",
      p: "signalstrength5gdbm",
      q: "signalstrength5gasulevel",
      a: "identity5gtac",
      sinr: "signalStrength5GCsiSinr",
      groupByQuery:
        " group by ci,identity5gtac,identity5GMcc,identity5GMnc,starttime,clientIdg,latitude,longitude,signalStrength5GDbm,signalStrength5GAsuLevel ",
    };
  }
  if (technologyType == "5GLte") {
    return {
      technologyTable: "5GLte",
      technology: "5glte",
      rat: "5GLte",
      ci: "identity5gltemci",
      p: "signalstrength5gltemrsrp",
      q: "signalstrength5gltemrsrq",
      a: "identity5gltemtac",

      groupByQuery:
        " group by ci,identity5GLteMtac,identity5gltemcc,identity5gltemnc,starttime,clientIdg,latitude,longitude,signalStrength5GLteMrsrp,signalStrength5GLteMrsrq ",
    };
  }
};
