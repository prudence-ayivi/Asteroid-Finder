'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AsteroidList from './components/AsteroidList';

export default function Home() {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [totalAsteroids, setTotalAsteroids] = useState(0);

  // Load total asteroids on mount
  useEffect(() => {
    const loadTotal = async () => {
      try {
        const res = await fetch(`/api/asteroids?date=2000-01-01`);
        const json = await res.json();
        if (json.total) {
          setTotalAsteroids(json.total);
        }
      } catch (err) {
        console.error('Error loading total:', err);
      }
    };
    loadTotal();
  }, []);

  const search = async () => {
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setSelectedAsteroid(null);

    try {
      const res = await fetch(`/api/asteroids?date=${date}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Error fetching data');
        setData(null);
      } else {
        setData(json);
        setError(null);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error - unable to reach server');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAsteroid = (asteroid) => {
    if (selectedAsteroid?.spkid === asteroid.spkid) {
      setSelectedAsteroid(null);
    } else {
      setSelectedAsteroid(asteroid);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white min-h-[25vh] flex flex-col justify-center px-8 relative overflow-hidden">
        <Image
          src="/asteroid-3d.webp"
          alt="Asteroid background"
          width={400}
          height={400}
          className="absolute right-5 bottom-1 opacity-60 w-auto h-auto"
          priority
        />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-sans">Asteroid Finder</h1>
          <p className="md:text-sm text-gray-300">Explore asteroids by discovery or first observation date</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-2 flex flex-col gap-8 p-8 max-w-3xl mx-auto w-full">
        {/* Database info */}
        {totalAsteroids > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600">Database contains</p>
            <p className="text-xl font-bold text-gray-900 font-sans">{totalAsteroids.toLocaleString()} Near Earth Objects</p>
            <p className="text-sm text-gray-500 mt-1">From NASA JPL Small-Body Database</p>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-3 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 transition"
              />
              <button
                onClick={search}
                disabled={loading}
                className="bg-gray-900 cursor-pointer hover:bg-gray-800 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-[12px] text-gray-500">The date are based on first officaily recorded observation, which for some objects diffred from official discovery date</p>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <div className="flex justify-center mb-4">
              <div className="animate-spin text-4xl">⟳</div>
            </div>
            <p className="text-gray-700 font-semibold">Loading data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {data && !loading && (
          <div>
            {/* Status message */}
            <div className={`rounded-lg shadow-sm p-6 mb-6 ${
              data.exact
                ? 'bg-green-50'
                : 'bg-blue-50'
            }`}>
              <p className={`font-semibold ${
                data.exact ? 'text-green-900' : 'text-blue-900'
              }`}>
                {data.message}
              </p>
              {!data.exact && data.closestDate && (
                <p className="text-sm text-gray-600 mt-2">
                  Closest date: <span className="font-semibold">{data.closestDate}</span>
                </p>
              )}
            </div>

            {/* Results */}
            {data.foundCount > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
                  {data.foundCount} object{data.foundCount !== 1 ? 's' : ''} found
                </h2>
                <AsteroidList
                  asteroids={data.objects}
                  selectedAsteroid={selectedAsteroid}
                  onSelectAsteroid={handleSelectAsteroid}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 font-semibold text-lg">No objects found</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && !data && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 font-semibold text-lg">Select a date to start exploring</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 text-sm py-6 px-8 border-t border-gray-700">
        <p>Asteroid Finder © 2025 - {new Date().getFullYear()} | By Prudence AYIVI</p>
      </div>
    </div>
  );
}
