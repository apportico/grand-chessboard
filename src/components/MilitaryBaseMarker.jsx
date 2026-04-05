import L from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';

export const OPERATOR_COLORS = {
  US: '#3b82f6',
  China: '#ef4444',
  Russia: '#991b1b',
  UK: '#1e3a5f',
  France: '#60a5fa',
  Turkey: '#14b8a6',
  India: '#f97316',
  Israel: '#e2e8f0',
  NATO: '#3b82f6',
};

function makeDiamondIcon(color) {
  return L.divIcon({
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
    html: `<svg width="14" height="14" viewBox="0 0 14 14">
      <rect x="2" y="2" width="10" height="10" rx="1" transform="rotate(45 7 7)" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
    </svg>`,
  });
}

export default function MilitaryBaseMarker({ base }) {
  const color = OPERATOR_COLORS[base.operator] || '#868e96';
  const icon = makeDiamondIcon(color);

  return (
    <Marker position={[base.lat, base.lon]} icon={icon}>
      <Tooltip direction="top" offset={[0, -8]}>
        <span className="font-semibold text-xs">{base.name} — {base.operator}</span>
      </Tooltip>
      <Popup maxWidth={280}>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-sm mb-0.5" style={{ color }}>{base.name}</p>
          <p className="text-gray-400 text-[11px] mb-2">{base.country}</p>

          <div className="mb-1.5">
            <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">OPERATOR</span>
            <p className="text-[11px] leading-snug mt-0.5">{base.operator}</p>
          </div>

          {base.type && (
            <div className="mb-1.5">
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                style={{ backgroundColor: color + '22', color }}
              >
                {base.type}
              </span>
            </div>
          )}

          {base.status && (
            <div className="mb-1.5">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">STATUS</span>
              <p className="text-[11px] leading-snug mt-0.5">{base.status}</p>
            </div>
          )}

          {base.tag && (
            <p className="text-[11px] italic mt-2 opacity-80 border-t border-gray-700/30 pt-1.5">
              {base.tag}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
