const districtBez = {
  lk: "Landkreis",
  ks: "Kreisfreie Stadt",
  kr: "Kreis",
  sk: "Stadtkreis",
};

const slopeBin = {
  g: "kein starker Trend",
  f: "leicht sinkend",
  s: "leicht steigend",
  st: "stark steigend",
  sf: "stark sinkend",
};

const slopeBinColorClass = {
  g: "keinTrend",
  f: "leichtSinkend",
  s: "leichtSteigend",
  st: "starkSteigend",
  sf: "starkSinkend",
};

const statesById = {
  "01": "Schleswig-Holstein",
  "02": "Hamburg",
  "03": "Niedersachsen",
  "04": "Bremen",
  "05": "Nordrhein-Westfalen",
  "06": "Hessen",
  "07": "Rheinland-Pfalz",
  "08": "Baden-Württemberg",
  "09": "Bayern",
  10: "Saarland",
  11: "Berlin",
  12: "Brandenburg",
  13: "Mecklenburg-Vorpommern",
  14: "Sachsen",
  15: "Sachsen-Anhalt",
  16: "Thüringen",
};

const statesByIso = {
  sh: "Schleswig-Holstein",
  hh: "Hamburg",
  ni: "Niedersachsen",
  hb: "Bremen",
  nw: "Nordrhein-Westfalen",
  he: "Hessen",
  rp: "Rheinland-Pfalz",
  bw: "Baden-Württemberg",
  by: "Bayern",
  sl: "Saarland",
  be: "Berlin",
  bb: "Brandenburg",
  mv: "Mecklenburg-Vorpommern",
  sn: "Sachsen",
  st: "Sachsen-Anhalt",
  th: "Thüringen",
};

export { districtBez, slopeBin, slopeBinColorClass, statesById, statesByIso };
