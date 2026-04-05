import { Polyline, Tooltip } from 'react-leaflet';

const TYPE_STYLE = {
  oil: { opacity: 0.6 },
  gas: { opacity: 0.6 },
};

export default function PipelineLayer({ pipeline }) {
  if (!pipeline.waypoints || pipeline.waypoints.length < 2) return null;

  const color = pipeline.color || (pipeline.type === 'oil' ? '#ef4444' : '#06b6d4');
  const weight = 2;

  return (
    <>
      {/* Glow */}
      <Polyline
        positions={pipeline.waypoints}
        pathOptions={{
          color,
          weight: weight + 4,
          opacity: 0.05,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Main line */}
      <Polyline
        positions={pipeline.waypoints}
        pathOptions={{
          color,
          weight,
          dashArray: pipeline.status?.toLowerCase().includes('operational') ? null : '6, 4',
          opacity: 0.55,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      >
        <Tooltip sticky>
          <div className="text-xs max-w-[220px]">
            <p className="font-bold" style={{ color }}>{pipeline.name}</p>
            <p className="opacity-70 mt-0.5 leading-snug">{pipeline.status}</p>
            {pipeline.capacity && (
              <p className="mt-0.5 opacity-50 text-[10px]">{pipeline.capacity}</p>
            )}
            <p className="mt-0.5 opacity-40 text-[10px] uppercase">{pipeline.type} pipeline</p>
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
}
