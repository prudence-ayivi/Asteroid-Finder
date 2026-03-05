import React from 'react'

export default function AboutPanel({ open, close, panelRef }) {  
  return (
    <div 
      ref={panelRef}
      className="fixed inset-0 top-27 md:top-21 left-7 w-[400px] max-w-[80vw] h-[90vh] bg-black/85 text-white shadow-xl rounded-xl p-5 overflow-y-auto z-50"
    >
      <button
        onClick={close}
        className="absolute top-5 right-5 font-semibold text-gray-400 hover:text-white cursor-pointer"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4">About this project</h2>

      <p className="text-sm leading-relaxed mb-4">
        This project allows ameteur and profesionnal astronomer, and citizen
        scientists to easily explore the growing catalog of asteroids detected
        by NASA. Instead of navigating complex databases, users can search
        and explore asteroid discoveries through this simplified interface.
      </p>

      <p className="text-sm leading-relaxed mb-4">
        The platform makes it possible to browse asteroid discoveries by date
        or search for specific objects by name or designation. This allows
        users to follow how asteroid discoveries evolve over time and to
        quickly identify objects of interest. 
        </p>

      <p className="text-sm leading-relaxed mb-4">
        How it works : <br />
        1. Search Near-Earth Objects by typing a name or designation or select a date to view objects discovered on that day <br />
        2. Select an object to view its details <br />
        If no object discovered on the day you pick, the closest objects discovored in ±5 days range will be displayed
        </p>

      <p className="text-sm leading-relaxed mb-4">
        The data used in this project comes from publicly available NASA JPL Small-Body Database. 
        The data are automatically retrieved and updated as new objects are discovered. Currently, it only show the NEOs, 
        but in the future it will be possible to explore all the small bodies in the solar system.
      </p>

      <p className="text-sm leading-relaxed mb-4">
        More than 1.5 million asteroids have been discovered, and the
        number continues to increase as surveys and citizen science projects
        contribute to new detections.
      </p>
    </div>
  );
}