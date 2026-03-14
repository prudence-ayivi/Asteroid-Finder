'use client';

import { getOrbitType, getOrbitTypeLabel } from '@/app/lib/asteroidClassification';
import { useState, useEffect } from "react";
import { Info } from "lucide-react";

export default function AsteroidDetails({ asteroid }) {
  const [futureCA, setFutureCA] = useState(null);
  const [showApproaches, setShowApproaches] = useState(false);

  useEffect(() => {
  async function fetchApproaches() {
    const res = await fetch(`/api/asteroids/approach?name=${encodeURIComponent(asteroid.name || asteroid.pdes)}`
    );
    const data = await res.json();
    setFutureCA(data);
  }

  fetchApproaches();
}, [asteroid]);


  if (!asteroid) return null;

  const orbitType = getOrbitType(asteroid.class);
  const objectDetails = `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(asteroid.name || asteroid.pdes)}`;

  // Determine if comet or asteroid
  const isComet = asteroid.class && ['ETc', 'JFc', 'JFC', 'CTc', 'HTC', 'PAR', 'HYP', 'COM'].includes(asteroid.class);
  const typeLabel = isComet ? 'Comet' : 'Asteroid';

  // Determine if PHA 
  const isPHA = Number(asteroid.moid) <= 0.05 && Number(asteroid.H) <= 22.0;

  // Format NEO/PHA statement
  const getNeoPhaSentence = () => {
    const parts = [];
    if (asteroid.neo) {
      parts.push('a Near-Earth Object (NEO)');
    }
    if (isPHA) {
      parts.push('a Potentially Hazardous Asteroid (PHA)');
    }
    if (parts.length === 0) return null;
    return parts.join(' and ');
  };

  const neoPhaSentence = getNeoPhaSentence();

  return (
    <div className="mt-4 bg-blue-50 rounded-lg p-3 md:p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-sans">
        {typeLabel} - {asteroid.name || asteroid.pdes} 
      </h2>
      <span className="rounded-full p-1 bg-gray-100 shadow-sm">
      <Info size={23} className={isPHA ? "text-red-600" : "text-gray-700"}
      />
      </span>
      </div>

      {neoPhaSentence && (
        <p className="text-gray-700 font-bold mb-4">Is {neoPhaSentence}.</p>
      )}

      {orbitType && (
        <div className="mb-4 p-2 bg-white rounded">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 font-semibold font-sans">
              Orbital Type :
            </p>
            <p className="text-gray-700 font-medium font-sans">
              {getOrbitTypeLabel(asteroid.class)}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">{orbitType.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-md mb-4">
        {asteroid.diameter && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Diameter :</span>{" "}
            {asteroid.diameter} km
          </p>
        )}

        {asteroid.first_obs && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">First Observation :</span>{" "}
            {asteroid.first_obs}
          </p>
        )}

        {asteroid.last_obs && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Last Observation :</span>{" "}
            {asteroid.last_obs}
          </p>
        )}

        {asteroid.a && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">
              Semi-major Axis (a) :
            </span>{" "}
            {asteroid.a} AU
          </p>
        )}

        {asteroid.e && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Eccentricity (e) :</span>{" "}
            {asteroid.e}
          </p>
        )}

        {asteroid.i && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Inclination (i) :</span>{" "}
            {asteroid.i}°
          </p>
        )}

        {asteroid.H && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">
              Absolute Magnitude :
            </span>{" "}
            {asteroid.H}
          </p>
        )}

        {asteroid.per_y && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Orbital Period :</span>{" "}
            {asteroid.per_y} years
          </p>
        )}

        {asteroid.n && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Mean Motion (n) :</span>{" "}
            {asteroid.n}°/day
          </p>
        )}

        {asteroid.q && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">
              Perihelion Distance (q) :
            </span>{" "}
            {asteroid.q} AU
          </p>
        )}

        {asteroid.ad && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">
              Aphelion Distance (ad) :
            </span>{" "}
            {asteroid.ad} AU 
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <a
          href={objectDetails}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition font-sans"
        >
          View full details here
        </a>

        {/* Future close approaches section */}
        {futureCA ? (
          <>
            <button
              onClick={() => setShowApproaches(!showApproaches)}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold py-2 px-4 rounded"
            >
              Has future close approach {showApproaches ? '▲' : '▼'}
            </button>
          </>
        ) : (
          <p className="text-gray-700 font-semibold pt-2">
            Has no future close approach
          </p>
        )}
      </div>
      {showApproaches && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Distance (AU)</th>
                <th className="text-left">Relative Velocity</th>
              </tr>
            </thead>
            <tbody>
              {futureCA.approaches.map((entry, index) => (
                <tr key={index}>
                  <td className="py-2">{entry.cd}</td>
                  <td >{entry.dist}</td>
                  <td>{entry.v_rel}  (km/s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
