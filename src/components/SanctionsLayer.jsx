import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { SANCTIONS_COLORS } from '../utils/colors';

export default function SanctionsLayer({ sanction }) {
  const color = SANCTIONS_COLORS[sanction.severity] || '#868e96';
  const radius = 6 + sanction.severity * 2; // 8-16px based on severity

  return (
    <CircleMarker
      center={[sanction.target_lat, sanction.target_lon]}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '4 3',
        opacity: sanction.status === 'active' ? 0.9 : 0.4,
      }}
    >
      <Tooltip
        direction="top"
        className="custom-tooltip"
        opacity={0.95}
      >
        <span style={{ fontSize: 11, fontWeight: 600 }}>{sanction.name}</span>
      </Tooltip>
      <Popup>
        <div style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            {sanction.name}
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
              Severity {sanction.severity}/5
            </span>
            <span style={{
              backgroundColor: sanction.status === 'active' ? '#e03131' : sanction.status === 'suspended' ? '#f59f00' : '#2f9e44',
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
              fontWeight: 600,
            }}>
              {sanction.status}
            </span>
            <span style={{
              backgroundColor: '#495057',
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
            }}>
              {sanction.type}
            </span>
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Imposer:</strong> {sanction.imposer}
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Target:</strong> {sanction.target_country}
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Period:</strong> {sanction.start_year}–{sanction.end_year || 'present'}
          </div>
          {sanction.key_measures?.length > 0 && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Measures:</strong>
              <ul style={{ margin: '2px 0 0 16px', padding: 0 }}>
                {sanction.key_measures.map((m, i) => (
                  <li key={i} style={{ fontSize: 11 }}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {sanction.impact_on_corridors?.length > 0 && (
            <div style={{ color: '#c92a2a', fontWeight: 600, fontSize: 11, marginTop: 4 }}>
              Affects: {sanction.impact_on_corridors.join(', ')}
            </div>
          )}
          {sanction.description && (
            <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
              {sanction.description}
            </div>
          )}
        </div>
      </Popup>
    </CircleMarker>
  );
}
