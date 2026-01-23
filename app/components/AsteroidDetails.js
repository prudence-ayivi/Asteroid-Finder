'use client';

import { getOrbitType, getOrbitTypeLabel } from '@/app/lib/asteroidClassification';

export default function AsteroidDetails({ asteroid }) {
  if (!asteroid) return null;

  const orbitType = getOrbitType(asteroid.class);
  const nasaLink = `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(asteroid.name || asteroid.pdes)}`;

  // Determine if comet or asteroid
  const isComet = asteroid.class && ['ETc', 'JFc', 'JFC', 'CTc', 'HTC', 'PAR', 'HYP', 'COM'].includes(asteroid.class);
  const typeLabel = isComet ? 'Comet' : 'Asteroid';

  // Format NEO/PHA statement
  const getNeoPhaSentence = () => {
    const parts = [];
    if (asteroid.neo) {
      parts.push('a Near-Earth Object (NEO)');
    }
    if (asteroid.pha) {
      parts.push('a Potentially Hazardous Asteroid (PHA)');
    }
    if (parts.length === 0) return null;
    return parts.join(' and ');
  };

  const neoPhaSentence = getNeoPhaSentence();

  return (
    <div className="mt-4 bg-blue-50 rounded-lg p-4 md:p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-4 font-sans">
        {typeLabel} - {asteroid.name || asteroid.pdes}
      </h2>

      {neoPhaSentence && (
        <p className="text-gray-700 font-bold mb-4">
          Is {neoPhaSentence}.
        </p>
      )}

      {orbitType && (
        <div className="mb-4 p-3 bg-white rounded">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 font-semibold font-sans">Orbital Type :</p>
            <p className="text-gray-700 font-medium font-sans">{getOrbitTypeLabel(asteroid.class)}</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">{orbitType.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {asteroid.diameter && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Diameter :</span> {asteroid.diameter} km
          </p>
        )}

        {asteroid.first_obs && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">First Observation :</span> {asteroid.first_obs}
          </p>
        )}

        {asteroid.last_obs && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Last Observation :</span> {asteroid.last_obs}
          </p>
        )}

        {asteroid.a && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Semi-major Axis (a) :</span> {asteroid.a} AU
          </p>
        )}

        {asteroid.e && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Eccentricity (e) :</span> {asteroid.e}
          </p>
        )}

        {asteroid.i && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Inclination (i) :</span> {asteroid.i}°
          </p>
        )}

        {asteroid.H && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Absolute Magnitude :</span> {asteroid.H}
          </p>
        )}

        {asteroid.per_y && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Orbital Period :</span> {asteroid.per_y} years
          </p>
        )}

        {asteroid.n && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Mean Motion (n) :</span> {asteroid.n}°/day
          </p>
        )}

        {asteroid.q && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Perihelion Distance (q) :</span> {asteroid.q} AU
          </p>
        )}

        {asteroid.ad && (
          <p className="text-gray-700">
            <span className="font-semibold font-sans">Aphelion Distance (ad) :</span> {asteroid.ad} AU
          </p>
        )}

      </div>

      <a
        href={nasaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition font-sans"
      >
        View full details here
      </a>
    </div>
  );
}
