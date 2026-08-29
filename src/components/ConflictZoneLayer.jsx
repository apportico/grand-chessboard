import { Circle, Popup, Tooltip } from 'react-leaflet';
import { CONFLICT_COLORS } from '../utils/colors';

export default function ConflictZoneLayer({ conflict }) {
  const color = CONFLICT_COLORS[conflict.type] || '#e03131';
  const radius = (conflict.radius_km || 200) * 1000; // km to meters

  return (
    <Circle
      center={[conflict.lat, conflict.lon]}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: conflict.status === 'ended' ? '6 4' : null,
        opacity: conflict.status === 'ended' ? 0.4 : 0.7,
      }}
    >
      <Tooltip
        direction="top"
        className="custom-tooltip"
        opacity={0.95}
      >
        <span style={{ fontSize: 11, fontWeight: 600 }}>{conflict.name}</span>
      </Tooltip>
      <Popup>
        <div style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            {conflict.name}
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
              {conflict.type?.replace('_', ' ')}
            </span>
            <span style={{
              backgroundColor: conflict.status === 'active' ? '#e03131' : conflict.status === 'frozen' ? '#f59f00' : '#868e96',
              color: '#fff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 3,
              fontWeight: 600,
            }}>
              {conflict.status}
            </span>
          </div>
          <div style={{ color: '#666', marginBottom: 4 }}>
            <strong>Period:</strong> {conflict.start_year}–{conflict.end_year || 'present'}
          </div>
          {conflict.parties && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Parties:</strong> {conflict.parties.join(' vs ')}
            </div>
          )}
          {conflict.casualty_estimate && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Casualties:</strong> {conflict.casualty_estimate}
            </div>
          )}
          {conflict.displacement && (
            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Displaced:</strong> {conflict.displacement}
            </div>
          )}
          {conflict.affected_corridors?.length > 0 && (
            <div style={{ color: '#c92a2a', marginBottom: 4, fontWeight: 600, fontSize: 11 }}>
              Affects: {conflict.affected_corridors.join(', ')}
            </div>
          )}
          {conflict.affected_chokepoints?.length > 0 && (
            <div style={{ color: '#e8590c', fontSize: 11 }}>
              Chokepoints: {conflict.affected_chokepoints.join(', ')}
            </div>
          )}
          {conflict.description && (
            <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
              {conflict.description}
            </div>
          )}
        </div>
      </Popup>
    </Circle>
  );
}
