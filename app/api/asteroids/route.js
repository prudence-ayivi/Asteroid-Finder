import data from "../../data/neos-by-date.json";

// Calculer le nombre total unique d'astéroïdes
function getTotalAsteroids() {
  const spkids = new Set();
  Object.values(data).forEach(asteroids => {
    asteroids.forEach(ast => {
      spkids.add(ast.spkid);
    });
  });
  return spkids.size;
}

// Trouver la date la plus proche
function findClosestDate(targetDate) {
  const dates = Object.keys(data);
  if (dates.length === 0) return null;

  const target = new Date(targetDate).getTime();
  let closest = null;
  let minDistance = Infinity;

  dates.forEach(dateStr => {
    const distance = Math.abs(new Date(dateStr).getTime() - target);
    if (distance < minDistance) {
      minDistance = distance;
      closest = dateStr;
    }
  });

  return closest;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return Response.json(
      { error: "Date parameter is required" },
      { status: 400 }
    );
  }

  const totalAsteroids = getTotalAsteroids();

  // Exact match
  if (data[date]) {
    return Response.json({
      success: true,
      date,
      exact: true,
      total: totalAsteroids,
      foundCount: data[date].length,
      message: `${data[date].length} object${data[date].length !== 1 ? 's' : ''} found for ${date}`,
      objects: data[date]
    });
  }

  // Search within ±5 days range
  const base = new Date(date);
  const fallback = [];
  const foundDates = new Map();

  for (let i = 1; i <= 5; i++) {
    const d1 = new Date(base);
    d1.setDate(d1.getDate() - i);

    const d2 = new Date(base);
    d2.setDate(d2.getDate() + i);

    const k1 = d1.toISOString().slice(0, 10);
    const k2 = d2.toISOString().slice(0, 10);

    if (data[k1]) {
      data[k1].forEach(ast => fallback.push(ast));
      if (!foundDates.has(k1)) foundDates.set(k1, data[k1].length);
    }
    if (data[k2]) {
      data[k2].forEach(ast => fallback.push(ast));
      if (!foundDates.has(k2)) foundDates.set(k2, data[k2].length);
    }
  }

  if (fallback.length > 0) {
    const closestDate = findClosestDate(date);
    return Response.json({
      success: true,
      date,
      exact: false,
      total: totalAsteroids,
      foundCount: fallback.length,
      closestDate,
      message: `No objects found for ${date}. ${fallback.length} object${fallback.length !== 1 ? 's' : ''} found within ±5 days (closest: ${closestDate})`,
      objects: fallback
    });
  }

  return Response.json({
    success: false,
    date,
    exact: false,
    total: totalAsteroids,
    foundCount: 0,
    message: `No objects found for ${date} or within ±5 days`,
    objects: []
  }, { status: 404 });
}