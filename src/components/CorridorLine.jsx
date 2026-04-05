import { Polyline, Tooltip } from 'react-leaflet';

export default function CorridorLine({ corridor }) {
  if (!corridor.waypoints || corridor.waypoints.length < 2) return null;

  const color = corridor.color || '#888';
  const weight = corridor.weight || 2;
  const dashArray = corridor.dashArray || null;

  return (
    <>
      {/* Glow underlay */}
      <Polyline
        positions={corridor.waypoints}
        pathOptions={{
          color,
          weight: weight + 5,
          opacity: 0.06,
          dashArray: null,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Main line */}
      <Polyline
        positions={corridor.waypoints}
        pathOptions={{
          color,
          weight,
          dashArray,
          opacity: 0.65,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      >
        <Tooltip sticky>
          <div className="text-xs max-w-[220px]">
            <p className="font-bold" style={{ color }}>{corridor.name}</p>
            <p className="opacity-70 mt-0.5 leading-snug">{corridor.status}</p>
            {corridor.type && (
              <p className="mt-1 opacity-50 text-[10px] uppercase tracking-wide">{corridor.type}</p>
            )}
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
}
