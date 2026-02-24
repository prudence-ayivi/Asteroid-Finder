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

      if (!index[first_obs]) {
        index[first_obs] = [];
      }

      index[first_obs].push({
        spkid,
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
        class: classValue,
        last_obs,
        H,
      });
    }

    const jsonString = JSON.stringify(index);

    await put("neos-by-date.json", JSON.stringify(index), {
      access: "public",
      allowOverwrite: true, // Enable overwriting an existing blob with the same pathname
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