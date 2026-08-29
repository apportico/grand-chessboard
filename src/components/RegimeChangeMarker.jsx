import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { REGIME_COLORS } from '../utils/colors';

export { REGIME_COLORS };

const ALIGNMENT_LABELS = {
  western: 'Western-aligned',
  russia: 'Russia-aligned',
  china: 'China-aligned',
  iran_influenced: 'Iran-influenced',
  neutral: 'Neutral',
  contested: 'Contested',
  failed_state: 'Failed state',
  taliban: 'Taliban',
};

function createRegimeIcon(color) {
  const svg = `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <polygon points="9,1 11.5,6.5 17,7.5 13,11.5 14,17 9,14.5 4,17 5,11.5 1,7.5 6.5,6.5" fill="${color}" fill-opacity="0.9" stroke="#fff" stroke-width="1"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function RegimeChangeMarker({ change }) {
  const color = REGIME_COLORS[change.type] || '#868e96';
  const icon = createRegimeIcon(color);

  return (
    <Marker
      position={[change.lat, change.lon]}
      icon={icon}
    >
      <Tooltip
        direction="top"
        className="custom-tooltip"
        opacity={0.95}
      >
        <span style={{ fontSize: 11, fontWeight: 600 }}>{change.name}</span>
      </Tooltip>
      <Popup>
        <div style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            {change.name}
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: color,
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              {change.type}
            </span>
            <span style={{
              backgroundColor: '#495057',
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
            }}>
              {change.year}
            </span>
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Country:</strong> {change.country}
          </div>
          {change.old_alignment && change.new_alignment && (
            <div style={{ marginBottom: 6, fontSize: 11 }}>
              <span style={{ color: '#868e96' }}>
                {ALIGNMENT_LABELS[change.old_alignment] || change.old_alignment}
              </span>
              <span style={{ margin: '0 6px', color: '#aaa' }}>&rarr;</span>
              <span style={{ color: '#e03131', fontWeight: 600 }}>
                {ALIGNMENT_LABELS[change.new_alignment] || change.new_alignment}
              </span>
            </div>
          )}
          {change.significance && (
            <div style={{ color: '#555', marginBottom: 4, fontWeight: 500 }}>
              {change.significance}
            </div>
          )}
          {change.impact_on_corridors?.length > 0 && (
            <div style={{ color: '#c92a2a', fontWeight: 600, fontSize: 11, marginTop: 4 }}>
              Affects: {change.impact_on_corridors.join(', ')}
            </div>
          )}
          {change.description && (
            <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
              {change.description}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
