import React from 'react';
import AsteroidItem from './AsteroidItem';
import AsteroidDetails from './AsteroidDetails';

const AsteroidList = ({ asteroids, selectedAsteroid, onSelectAsteroid }) => {
  if (!asteroids || asteroids.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500 font-semibold">No asteroids found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
      {asteroids.map((asteroid) => (
        <div key={asteroid.spkid}>
          <AsteroidItem
            asteroid={asteroid}
            isSelected={selectedAsteroid?.spkid === asteroid.spkid}
            onSelect={onSelectAsteroid}
          />
          {selectedAsteroid?.spkid === asteroid.spkid && (
            <AsteroidDetails asteroid={asteroid} />
          )}
        </div>
      ))}
    </div>
  );
};

export default AsteroidList;