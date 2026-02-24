import { put } from "@vercel/blob";

export async function GET() {
  try {
    const nasaRes = await fetch(
      "https://ssd-api.jpl.nasa.gov/sbdb_query.api?neo=Y&pha=Y&fields=spk_id,full_name,pdes,name,diameter,e,a,q,i,om,ma,ad,n,per,per_y,class,first_obs,last_obs,H"
    );

    if (!nasaRes.ok) {
      return new Response("NASA fetch failed", { status: 500 });
    }

    const data = await nasaRes.json();

    const objects = data.data;

    const index = {};

    for (const obj of objects) {
      const [spk_id, name, first_obs, abs_mag] = obj;

      if (!index[first_obs]) {
        index[first_obs] = [];
      }

      index[first_obs].push({
        spk_id,
        full_name,
      pdes,
      name,
      neo,
      pha,
      diameter,
      e,
      a,
      q,
      i, 
      om,
      ma,
      ad,
      n,
      per,
      per_y,
      class: row.class,
      first_obs,
      last_obs,
      H,
      });
    }

    const jsonString = JSON.stringify(index);

    await put("neos-by-date.json", jsonString, {
      access: "public",
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