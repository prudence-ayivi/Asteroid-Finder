// lib/buildIndex.js ; 
import fs from "fs";
import csv from "csv-parser";
import path from "path";

const index = {};
const csvPath = path.join(process.cwd(), "public", "neos_sbdb_query_0102.csv");
fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    const date = row.first_obs; // YYYY-MM-DD
    if (!date) return;

    if (!index[date]) index[date] = [];

    index[date].push({
      spkid: row.spkid,
      full_name: row.full_name,
      pdes: row.pdes,
      name: row.name,
      neo: row.neo === "Y",
      pha: row.pha === "Y" || row.pha === "N",
      diameter: row.diameter,
      e: row.e,
      a: row.a,
      q: row.q,
      i: row.i, 
      om: row.om,
      ma: row.ma,
      ad: row.ad,
      n: row.n,
      per: row.per,
      per_y: row.per_y,
      class: row.class,
      first_obs: date,
      last_obs: row.last_obs,
      H: row.H,
    });
  })
  .on("end", () => {
    fs.writeFileSync(
      "app/data/neos-by-date.json",
      JSON.stringify(index, null, 2)
    );
    console.log("DATES:", Object.keys(index).length);

  });
