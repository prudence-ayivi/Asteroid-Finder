import { put } from "@vercel/blob";


export async function GET() {
  try {
    const nasaRes = await fetch(
      "https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=spkid,full_name,pdes,name,diameter,e,a,q,i,om,ma,ad,n,per,per_y,class,first_obs,last_obs,H&sb-group=neo"
    );

    if (!nasaRes.ok) {
      const errorText = await nasaRes.text();
      console.error("NASA API error:", errorText);
      return new Response("NASA fetch failed", { status: 500 });
    }

    const data = await nasaRes.json();

    const objects = data.data;

    const index = {};
    // if (!index[date]) index[date] = [];

    for (const obj of objects) {
      const [spkid, full_name, pdes, name, neo, pha, diameter, e, a, q, i, om, ma, ad, n, per, per_y, classValue, first_obs, last_obs, H] = obj;

      const date = first_obs; // YYYY-MM-DD
      if (!date) return;

      if (!index[date]) {
        index[date] = [];
      }

      index[date].push({
      spkid: obj[0],
      full_name: obj[1],
      pdes: obj[2],
      name: obj[3],
      neo: obj[4] === "Y",
      pha: obj[5] === "Y" || obj[5] === "N",
      diameter: obj[6],
      e: obj[7],
      a: obj[8],
      q: obj[9],
      i: obj[10], 
      om: obj[11],
      ma: obj[12],
      ad: obj[13],
      n: obj[14],
      per: obj[15],
      per_y: obj[16],
      class: obj[17],
      first_obs: date,
      last_obs: obj[19],
      H: obj[20],
      });
    }

    await put("neos-by-date.json", JSON.stringify(index), {
      access: "public",
      allowOverwrite: true, 
      contentType: "application/json"
    });

    return Response.json({
      success: true,
      dates: Object.keys(index).length
    });

  } catch (err) {
    return new Response("Sync failed", { status: 500 });
  }
}