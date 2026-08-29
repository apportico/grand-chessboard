import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { NAVAL_COLORS } from '../utils/colors';

export { NAVAL_COLORS };

function createNavalIcon(color) {
  const svg = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" fill="${color}" fill-opacity="0.85" stroke="#fff" stroke-width="1.5"/>
    <path d="M6 12 L10 6 L14 12 Z" fill="#fff" fill-opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function NavalMarker({ deployment }) {
  const color = NAVAL_COLORS[deployment.operator] || '#868e96';
  const icon = createNavalIcon(color);

  return (
    <Marker
      position={[deployment.lat, deployment.lon]}
      icon={icon}
    >
      <Tooltip
        direction="top"
        className="custom-tooltip"
        opacity={0.95}
      >
        <span style={{ fontSize: 11, fontWeight: 600 }}>{deployment.name}</span>
      </Tooltip>
      <Popup>
        <div style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            {deployment.name}
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: color,
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
              fontWeight: 600,
            }}>
              {deployment.operator}
            </span>
            <span style={{
              backgroundColor: '#495057',
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
            }}>
              {deployment.force_type}
            </span>
            <span style={{
              backgroundColor: deployment.status === 'permanent' ? '#2f9e44' : '#f59f00',
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
            }}>
              {deployment.status}
            </span>
          </div>
          {deployment.home_port && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Base:</strong> {deployment.home_port}
            </div>
          )}
          {deployment.mission && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Mission:</strong> {deployment.mission}
            </div>
          )}
          {deployment.vessels && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Vessels:</strong> {deployment.vessels}
            </div>
          )}
          {deployment.controls_chokepoints?.length > 0 && (
            <div style={{ color: '#c92a2a', fontWeight: 600, fontSize: 11, marginTop: 4 }}>
              Controls: {deployment.controls_chokepoints.join(', ')}
            </div>
          )}
          {deployment.description && (
            <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
              {deployment.description}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
