'use client';

export default function AsteroidItem({ asteroid, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(asteroid)}
      className={`
        w-full text-left p-4 border-1 rounded-lg transition-all cursor-pointer
        ${isSelected
          ? 'bg-gray-200 text-black'
          : 'bg-white hover:bg-gray-200 text-gray-900'
        }
      `}
    >
      <h3 className="text-lg font-semibold font-sans">
        {asteroid.name || asteroid.pdes}
      </h3>
    </button>
  );
}
