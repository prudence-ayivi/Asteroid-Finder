"use client"
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState("");
  const [data, setData] = useState(null);

  const search = async () => {
    const res = await fetch(`/api/asteroids?date=${date}`);
    const json = await res.json();
    setData(json);

    if (!res.ok) {
  const text = await res.text();
  console.error(text);
  return;
}

  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Asteroids discovered by date</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mr-2"
      />

      <button onClick={search} className="bg-black text-white px-4 py-2">
        Search
      </button>

      {data && (
        <pre className="mt-6 bg-gray-100 p-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
