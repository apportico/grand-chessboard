import L from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';

export const CATEGORY_COLORS = {
  // Mining
  uranium: '#22c55e',
  rare_earth: '#a855f7',
  lithium: '#06b6d4',
  cobalt: '#3b82f6',
  copper: '#f97316',
  steel: '#6b7280',
  semiconductor: '#ec4899',
  aluminum: '#94a3b8',
  nickel: '#84cc16',
  iron_ore: '#b45309',
  // Energy infrastructure
  refinery: '#ef4444',
  lng_terminal: '#0ea5e9',
  oil_field: '#b91c1c',
  gas_field: '#0891b2',
  oil_gas_field: '#dc2626',
  nuclear: '#facc15',
};

const CATEGORY_ICONS = {
  uranium: '☢',
  rare_earth: '⬡',
  lithium: '⚡',
  cobalt: '◈',
  copper: '◆',
  steel: '▬',
  semiconductor: '◻',
  aluminum: '△',
  nickel: '◇',
  refinery: '⛽',
  lng_terminal: '🔷',
  oil_field: '●',
  gas_field: '●',
  nuclear: '⚛',
};

function createIcon(category) {
  const color = CATEGORY_COLORS[category] || '#6b7280';
  return L.divIcon({
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="7,1 13,7 7,13 1,7" fill="${color}" stroke="#ffffff" stroke-width="1.2" opacity="0.85"/>
    </svg>`,
  });
}

export default function ResourceMarker({ resource }) {
  const category = resource.category;
  const color = CATEGORY_COLORS[category] || '#6b7280';

  return (
    <Marker
      position={[resource.lat, resource.lon]}
      icon={createIcon(category)}
    >
      <Tooltip direction="top" offset={[0, -8]}>
        <span className="font-semibold text-xs">{resource.name}</span>
      </Tooltip>
      <Popup maxWidth={280}>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-sm mb-0.5" style={{ color }}>{resource.name}</p>
          <p className="text-gray-400 text-[11px] mb-1">{resource.country}</p>

          <div className="flex gap-1 mb-2 flex-wrap">
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white capitalize"
              style={{ backgroundColor: color }}
            >
              {(category || '').replace(/_/g, ' ')}
            </span>
          </div>

          {resource.owner && (
            <div className="mb-1">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Owner</span>
              <p className="text-[11px] leading-snug mt-0.5">{resource.owner}</p>
            </div>
          )}

          {(resource.production || resource.capacity || resource.description) && (
            <div className="mb-1">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Details</span>
              <p className="text-[11px] leading-snug mt-0.5">
                {resource.production || resource.capacity || resource.description}
              </p>
            </div>
          )}

          {resource.tag && (
            <p className="text-[11px] italic opacity-70 mt-1">{resource.tag}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
