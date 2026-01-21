import data from "../../data/neos-by-date.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return Response.json(
      { error: "Date parameter is required" },
      { status: 400 }
    );
  }

  if (data[date]) {
    return Response.json({
      date,
      exact: true,
      objects: data[date]
    });
  }

  const base = new Date(date);
  const fallback = [];

  for (let i = 1; i <= 5; i++) {
    const d1 = new Date(base);
    d1.setDate(d1.getDate() - i);

    const d2 = new Date(base);
    d2.setDate(d2.getDate() + i);

    const k1 = d1.toISOString().slice(0, 10);
    const k2 = d2.toISOString().slice(0, 10);

    if (data[k1]) fallback.push(...data[k1]);
    if (data[k2]) fallback.push(...data[k2]);
  }

  return Response.json({
    date,
    exact: false,
    objects: fallback
  });
}