import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { ALIGNMENT_COLORS } from '../utils/colors';

export default function PortMarker({ port }) {
  const color = ALIGNMENT_COLORS[port.alignment] || '#868e96';
  // Original ports have `details` object; expanded ports have `operator`/`status` strings
  const hasDetails = port.details && typeof port.details === 'object';
  const location = port.location || port.country || '';

  return (
    <>
      {/* Soft glow ring */}
      <CircleMarker
        center={[port.lat, port.lon]}
        radius={10}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 0,
        }}
      />
      {/* Core dot */}
      <CircleMarker
        center={[port.lat, port.lon]}
        radius={5}
        pathOptions={{
          color: '#ffffff',
          fillColor: color,
          fillOpacity: 0.9,
          weight: 1.5,
        }}
      >
        <Tooltip direction="top" offset={[0, -6]}>
          <span className="font-semibold text-xs">{port.name}</span>
        </Tooltip>
        <Popup maxWidth={280}>
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-sm mb-0.5" style={{ color }}>{port.name}</p>
            <p className="text-gray-400 text-[11px] mb-2">{location}</p>

            {port.tag && (
              <p className="text-[11px] italic mb-2 opacity-80">{port.tag}</p>
            )}

            {/* Rich detail format (original 20 ports) */}
            {hasDetails &&
              Object.entries(port.details).map(([key, value]) => (
                <div key={key} className="mb-1.5">
                  <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">{key}</span>
                  <p className="text-[11px] leading-snug mt-0.5">{value}</p>
                </div>
              ))}

            {/* Simple format (expanded ports) */}
            {!hasDetails && port.operator && (
              <div className="mb-1.5">
                <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">OPERATOR</span>
                <p className="text-[11px] leading-snug mt-0.5">{port.operator}</p>
              </div>
            )}
            {!hasDetails && port.status && (
              <div className="mb-1.5">
                <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">STATUS</span>
                <p className="text-[11px] leading-snug mt-0.5">{port.status}</p>
              </div>
            )}
            {!hasDetails && port.corridors && port.corridors.length > 0 && (
              <div className="mb-1.5">
                <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">CORRIDORS</span>
                <p className="text-[11px] leading-snug mt-0.5">{port.corridors.join(', ')}</p>
              </div>
            )}

            {port.alert && (
              <p className="text-[11px] text-red-400 font-medium mt-2 border-t border-red-900/30 pt-1.5">
                {port.alert}
              </p>
            )}
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
