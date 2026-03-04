const BLOB_URL = process.env.BLOB_URL;

let cachedData = null;
let cachedTotal = null;
let lastFetchTime = 0;

const CACHE_DURATION = 1000 * 60 * 60; // 1h en ms

async function getAsteroids() {
  const response = await fetch(BLOB_URL, {
    next: { revalidate: CACHE_DURATION } // cache 1h
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blob data");
  }

  return response.json();
}

function getTotalAsteroids(data) {
  const spkids = new Set();
  Object.values(data).forEach(asteroids => {
    asteroids.forEach(asteroid => {
      spkids.add(asteroid.spkid);
    });
  });
  return spkids.size;
}

export async function getNeoData() {
  const now = Date.now();

  // Si cache valide, return
  if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
    return { data: cachedData, total: cachedTotal };
  }

  // Si cache invalide, recharger depuis Blob
  const data = await getAsteroids();
  const total = getTotalAsteroids(data);

  cachedData = data;
  cachedTotal = total;
  lastFetchTime = now;

  return { data, total };
}