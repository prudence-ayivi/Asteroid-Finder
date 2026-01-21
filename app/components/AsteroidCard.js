export default function AsteroidCard({ asteroid }) {
  return (
    <div className="border rounded p-4 mb-3">
      <h3 className="font-semibold">
        {asteroid.name} ({asteroid.spk_id})
      </h3>

      <p>First observation: {asteroid.first_obs}</p>
      <p>NEO: {asteroid.neo ? "Yes" : "No"}</p>

      {asteroid.abs_mag && <p>Absolute Magnitude: {asteroid.abs_mag}</p>}
    </div>
  );
}
