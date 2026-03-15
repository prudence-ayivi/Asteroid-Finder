import { put } from "@vercel/blob";
import {NextResponse} from 'next/server';

export async function GET(request) {

  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {  

    const nasaRes = await fetch(
      "https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=spkid,full_name,pdes,name,diameter,e,a,q,i,om,ma,ad,n,per,per_y,class,first_obs,last_obs,H,moid&sb-group=neo",
    );
    
    if (!nasaRes.ok) {
      const errorText = await nasaRes.text();
      console.error("NASA API error:", errorText);
      return NextResponse.json({ error: "NASA fetch failed" }, { status: 500 });
    }

    const data = await nasaRes.json();

    const objects = data.data;

    const index = {};

    for (const obj of objects) {
      const [spkid, full_name, pdes, name, diameter, e, a, q, i, om, ma, ad, n, per, per_y, classValue, first_obs, last_obs, H, moid] = obj;

      const date = first_obs; // YYYY-MM-DD
      if (!date) continue;

      if (!index[date]) {
        index[date] = [];
      }

      index[date].push({
      spkid: spkid,
      full_name: full_name,
      pdes: pdes,
      name: name,
      neo: true,
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
      moid: moid
      });
    }

    await put("neos-by-date.json", JSON.stringify(index), {
      access: "public",
      allowOverwrite: true, 
      contentType: "application/json", 
    });

    return NextResponse.json({
      success: true,
      dates: Object.keys(index).length
    });

  } catch (err) {
    console.error("Error during sync:", err);
    return NextResponse.json("Sync failed", { status: 500 });
  }
}