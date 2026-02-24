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
      e: e,
      a: a,
      q: q,
      i: i,
      om: om,
      ma: ma,
      ad: ad,
      n: n,
      per: per,
      per_y: per_y,
      class: classValue,
      first_obs: date,
      last_obs: last_obs,
      H: H,
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