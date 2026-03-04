export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return Response.json({ error: "Name required" }, { status: 400 });
  } 
  
  try {
  const nasaRes = await fetch(
    `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(name)}&ca-data=true&ca-body=Earth&no-orbit=true`, {
    next: { revalidate: 86400 } // cache for 24h 
    }
  );

  const result = await nasaRes.json();
  const caData = result.ca_data || [];

  const today = new Date();

  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  const parseNASAdate = (str) => {
    const [datePart, timePart] = str.split(" ");
    const [year, monthStr, day] = datePart.split("-");
    return new Date(`${year}-${months[monthStr]}-${day}T${timePart}:00`);
  };

  // Filtrer dates futures ou aujourd’hui
  const futureApproaches = caData
    .map(entry => ({
      ...entry,
      parsedDate: parseNASAdate(entry.cd)
    }))
    .filter(entry => entry.parsedDate >= today)
    .sort((a, b) => a.parsedDate - b.parsedDate)
    .slice(0, 5); // Limiter à 5 approches futures;

  return Response.json({
    hasFuture: futureApproaches.length > 0,
    approaches: futureApproaches
  });

  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
    }
}
