import { getNeoData } from "@/app/lib/neoData";

const { data } = await getNeoData();

function makeMessage(count, name) {
  if (count === 0) return `No results for "${name}"`;
  return `${count} result${count !== 1 ? 's' : ''} for "${name}"`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get('name') || '').trim();
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  if (!name) {
    return Response.json({ success: false, message: 'Query parameter `name` is required', objects: [] }, { status: 400 });
  }

  const search = name.toLowerCase();
  const results = [];

  // Iterate date buckets and their arrays; stop once limit reached to avoid scanning everything
  const dates = Object.keys(data);
  for (let i = 0; i < dates.length && results.length < limit; i++) {
    const bucket = data[dates[i]];
    for (let j = 0; j < bucket.length && results.length < limit; j++) {
      const asteroid = bucket[j];
      const full = (asteroid.full_name || '').toLowerCase();
      const name = (asteroid.name || '').toLowerCase();
      const pdes = (asteroid.pdes || '').toLowerCase();

      if (
        (full && full.includes(search)) ||
        (name && name.includes(search)) ||
        (pdes && pdes.includes(search))
      ) {
        results.push(asteroid);
      }
    }
  }

  return Response.json({
    success: true,
    query: name,
    totalMatches: results.length,
    limit,
    message: makeMessage(results.length, name),
    objects: results
  });
}
