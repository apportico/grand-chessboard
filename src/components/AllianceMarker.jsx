import L from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';

const TYPE_COLORS = {
  military_alliance: '#1971c2',
  economic_bloc: '#2f9e44',
  bilateral_deal: '#7048e8',
  intelligence: '#e03131',
  energy_partnership: '#e8590c',
  financial_partnership: '#f59f00',
  technology_partnership: '#ec4899',
  maritime_security: '#0ea5e9',
  infrastructure_pact: '#0d9488',
};

const TYPE_ICONS = {
  military_alliance: '\u2694',   // crossed swords
  economic_bloc: '\u229E',       // squared plus
  bilateral_deal: '\u2691',      // flag
  intelligence: '\u25C9',        // fisheye
  energy_partnership: '\u26A1',  // lightning
  financial_partnership: '$',
  technology_partnership: '\u25A3', // square with fill
  maritime_security: '\u2693',   // anchor
  infrastructure_pact: '\u2616', // heavy saltire (roads)
};

const ALIGNMENT_LABELS = {
  western: 'Western',
  china: 'China-aligned',
  india: 'India-aligned',
  mixed: 'Mixed',
  neutral: 'Neutral',
  contested: 'Contested',
};

function createIcon(type, status) {
  const color = TYPE_COLORS[type] || '#6b7280';
  const isCollapsed = status === 'collapsed';
  const opacity = isCollapsed ? 0.5 : 0.9;
  const stroke = isCollapsed ? '#868e96' : '#ffffff';
  return L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="7" fill="${color}" stroke="${stroke}" stroke-width="1.5" opacity="${opacity}"/>
      <text x="9" y="13" text-anchor="middle" font-size="9" fill="#fff">${TYPE_ICONS[type] || '\u2691'}</text>
    </svg>`,
  });
}

export default function AllianceMarker({ alliance }) {
  const lat = alliance.hq_lat;
  const lon = alliance.hq_lon;
  if (lat == null || lon == null) return null;

  const color = TYPE_COLORS[alliance.type] || '#6b7280';
  const typeLabel = (alliance.type || '').replace(/_/g, ' ');

  return (
    <Marker
      position={[lat, lon]}
      icon={createIcon(alliance.type, alliance.status)}
    >
      <Tooltip direction="top" offset={[0, -10]}>
        <span className="font-semibold text-xs">{alliance.name}</span>
      </Tooltip>
      <Popup maxWidth={340} minWidth={280}>
        <div className="text-xs leading-relaxed">
          {/* Header */}
          <p className="font-bold text-sm mb-0.5" style={{ color }}>{alliance.name}</p>

          {/* Badges */}
          <div className="flex gap-1 mb-2 flex-wrap">
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white capitalize"
              style={{ backgroundColor: color }}
            >
              {typeLabel}
            </span>
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize"
              style={{
                backgroundColor: alliance.status === 'collapsed' ? '#868e96'
                  : alliance.status === 'stalled' ? '#f59f00'
                  : alliance.status === 'expanding' ? '#2f9e44'
                  : alliance.status === 'planned' ? '#0ea5e9'
                  : '#1971c2',
                color: '#fff',
              }}
            >
              {alliance.status}
            </span>
            {alliance.alignment && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 capitalize">
                {ALIGNMENT_LABELS[alliance.alignment] || alliance.alignment}
              </span>
            )}
          </div>

          {/* Signed & Duration */}
          <div className="mb-2 border-l-2 pl-2" style={{ borderColor: color }}>
            {alliance.signed_date && (
              <div className="mb-1">
                <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Signed</span>
                <p className="text-[11px] leading-snug">{alliance.signed_date}</p>
              </div>
            )}
            {alliance.duration && (
              <div className="mb-1">
                <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Duration</span>
                <p className="text-[11px] leading-snug">{alliance.duration}</p>
              </div>
            )}
          </div>

          {/* Members */}
          {alliance.members && alliance.members.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Members ({alliance.members.length})</span>
              <p className="text-[11px] leading-snug mt-0.5">{alliance.members.join(', ')}</p>
            </div>
          )}

          {/* Key Signatories */}
          {alliance.signatories && Object.keys(alliance.signatories).length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Key Signatories</span>
              <div className="mt-0.5 space-y-0.5">
                {Object.entries(alliance.signatories).slice(0, 6).map(([country, person]) => (
                  <div key={country} className="flex gap-1 text-[11px]">
                    <span className="font-medium text-gray-700 flex-shrink-0">{country}:</span>
                    <span className="text-gray-500">{person}</span>
                  </div>
                ))}
                {Object.keys(alliance.signatories).length > 6 && (
                  <p className="text-[10px] text-gray-400 italic">+{Object.keys(alliance.signatories).length - 6} more</p>
                )}
              </div>
            </div>
          )}

          {/* Strategic Value */}
          {alliance.strategic_value && (
            <div className="mb-2">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Strategic Value</span>
              <p className="text-[11px] leading-snug mt-0.5">{alliance.strategic_value}</p>
            </div>
          )}

          {/* Corridor Impact */}
          {alliance.corridor_impact && (
            <div className="mb-2 p-1.5 rounded" style={{ backgroundColor: color + '15', borderLeft: `2px solid ${color}` }}>
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Corridor Impact</span>
              <p className="text-[11px] leading-snug mt-0.5">{alliance.corridor_impact}</p>
            </div>
          )}

          {/* Tag */}
          {alliance.tag && (
            <p className="text-[11px] font-bold mt-2" style={{ color }}>{alliance.tag}</p>
          )}

          {/* Alert */}
          {alliance.alert && (
            <div className="mt-1.5 p-1.5 rounded bg-red-50 border-l-2 border-red-400">
              <p className="text-[11px] text-red-700">{alliance.alert}</p>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
