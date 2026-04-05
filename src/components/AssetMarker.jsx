import L from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';

export const OWNER_COLORS = {
  UAE: '#f59f00',
  US: '#3b82f6',
  Israel: '#e2e8f0',
  Armenia: '#a855f7',
  China: '#ef4444',
  Russia: '#991b1b',
  'Saudi Arabia': '#22c55e',
  India: '#f97316',
  Turkey: '#14b8a6',
  UK: '#1e3a5f',
};

function makeSquareIcon(color) {
  return L.divIcon({
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -7],
    html: `<svg width="12" height="12" viewBox="0 0 12 12">
      <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
    </svg>`,
  });
}

export default function AssetMarker({ asset }) {
  const color = OWNER_COLORS[asset.owner] || '#868e96';
  const icon = makeSquareIcon(color);

  return (
    <Marker position={[asset.lat, asset.lon]} icon={icon}>
      <Tooltip direction="top" offset={[0, -7]}>
        <span className="font-semibold text-xs">{asset.name}</span>
      </Tooltip>
      <Popup maxWidth={280}>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-sm mb-0.5" style={{ color }}>{asset.name}</p>
          <p className="text-gray-400 text-[11px] mb-2">{asset.country}</p>

          <div className="mb-1.5">
            <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">OWNER</span>
            <p className="text-[11px] leading-snug mt-0.5">{asset.owner}</p>
          </div>

          <div className="mb-1.5 flex gap-1.5 flex-wrap">
            {asset.category && (
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                style={{ backgroundColor: color + '22', color }}
              >
                {asset.category}
              </span>
            )}
            {asset.subcategory && (
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-800 text-gray-300"
              >
                {asset.subcategory}
              </span>
            )}
          </div>

          {asset.description && (
            <div className="mb-1.5">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">DESCRIPTION</span>
              <p className="text-[11px] leading-snug mt-0.5">{asset.description}</p>
            </div>
          )}

          {asset.tag && (
            <p className="text-[11px] italic mt-2 opacity-80 border-t border-gray-700/30 pt-1.5">
              {asset.tag}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
