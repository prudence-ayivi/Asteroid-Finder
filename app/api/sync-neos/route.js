import { put } from "@vercel/blob";


export async function GET() {
  try {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    const nasaRes = await fetch(
      "https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=spkid,full_name,pdes,name,diameter,e,a,q,i,om,ma,ad,n,per,per_y,class,first_obs,last_obs,H&sb-group=neo",
      {
        headers: {
          "User-Agent": "neo-app-vercel"
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);
    
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
      spkid: spkid,
      full_name: full_name,
      pdes: pdes,
      name: name,
      neo: neo === "Y",
      pha: pha === "Y" || pha === "N",
      diameter: diameter,
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

    console.log(process.env.BLOB_READ_WRITE_TOKEN);

    await put("neos-by-date.json", JSON.stringify(index), {
      access: "public",
      allowOverwrite: true, 
      contentType: "application/json", 
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log("Blob uploaded");

    return Response.json({
      success: true,
      dates: Object.keys(index).length
    });

  } catch (err) {
    console.error("Error during sync:", err);
    return new Response("Sync failed", { status: 500 });
  }
}