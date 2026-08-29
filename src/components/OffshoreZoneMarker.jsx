import { CircleMarker, Circle, Popup, Tooltip } from 'react-leaflet';

const CATEGORY_COLORS = {
  financial: '#f59f00',
  eez: '#1971c2',
  military_offshore: '#e03131',
};

const TYPE_COLORS = {
  tax_haven: '#f59f00',
  contested_maritime: '#e03131',
  energy_eez: '#0ea5e9',
  sovereign_eez: '#1971c2',
  deep_sea_mining: '#7048e8',
  military_base: '#e03131',
  contested_island: '#da3633',
  artificial_island: '#c92a2a',
  debt_trap_port: '#9c36b5',
};

const STATUS_BADGE_COLORS = {
  active: '#2f9e44',
  contested: '#e03131',
  declining: '#f59f00',
  controlled: '#1971c2',
  expanding: '#0ea5e9',
};

export default function OffshoreZoneMarker({ zone }) {
  const color = TYPE_COLORS[zone.type] || CATEGORY_COLORS[zone.category] || '#868e96';
  const isEEZ = zone.category === 'eez';
  const isFinancial = zone.category === 'financial';
  const isMilitary = zone.category === 'military_offshore';

  // EEZ zones get larger circles, financial gets medium, military gets small
  const radius = isEEZ ? 14 : isFinancial ? 8 : 10;

  return (
    <>
      {/* Glow ring */}
      <CircleMarker
        center={[zone.lat, zone.lon]}
        radius={radius + 6}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 1,
          opacity: 0.15,
        }}
        interactive={false}
      />
      {/* Core marker */}
      <CircleMarker
        center={[zone.lat, zone.lon]}
        radius={radius}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: isEEZ ? 0.2 : 0.35,
          weight: 2,
          opacity: zone.status === 'contested' ? 0.9 : 0.7,
          dashArray: zone.status === 'contested' ? '4 3' : undefined,
        }}
      >
        <Tooltip direction="top" className="custom-tooltip" opacity={0.95}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{zone.name}</span>
        </Tooltip>
        <Popup>
          <div style={{ maxWidth: 280, fontSize: 12, lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {zone.name}
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: CATEGORY_COLORS[zone.category] || '#868e96',
                color: '#fff',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                fontWeight: 600,
              }}>
                {zone.category === 'financial' ? 'FINANCIAL' : zone.category === 'eez' ? 'EEZ' : 'MILITARY'}
              </span>
              <span style={{
                backgroundColor: TYPE_COLORS[zone.type] || '#495057',
                color: '#fff',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                fontWeight: 600,
              }}>
                {zone.type.replace(/_/g, ' ')}
              </span>
              <span style={{
                backgroundColor: STATUS_BADGE_COLORS[zone.status] || '#868e96',
                color: '#fff',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                fontWeight: 600,
              }}>
                {zone.status}
              </span>
            </div>

            <div style={{ color: '#666', marginBottom: 4 }}>
              <strong>Controller:</strong> {zone.controller}
            </div>

            {zone.beneficiaries && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Beneficiaries:</strong> {Array.isArray(zone.beneficiaries) ? zone.beneficiaries.join(', ') : zone.beneficiaries}
              </div>
            )}

            {zone.assets_held && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Assets:</strong> {zone.assets_held}
              </div>
            )}

            {zone.registered_entities && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Entities:</strong> {zone.registered_entities.toLocaleString()}
              </div>
            )}

            {zone.area_km2 && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Area:</strong> {zone.area_km2.toLocaleString()} km²
              </div>
            )}

            {zone.resources && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Resources:</strong> {zone.resources}
              </div>
            )}

            {zone.personnel && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Personnel:</strong> {zone.personnel.toLocaleString()}
              </div>
            )}

            {zone.capabilities && (
              <div style={{ color: '#666', marginBottom: 4 }}>
                <strong>Capabilities:</strong> {zone.capabilities}
              </div>
            )}

            {zone.strategic_value && (
              <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
                {zone.strategic_value}
              </div>
            )}

            {zone.tag && (
              <div style={{ color: '#1971c2', fontWeight: 700, fontSize: 11, marginTop: 6 }}>
                {zone.tag}
              </div>
            )}

            {zone.alert && (
              <div style={{ color: '#c92a2a', fontWeight: 600, fontSize: 11, marginTop: 4, padding: '4px 6px', backgroundColor: '#fff5f5', borderRadius: 3 }}>
                {zone.alert}
              </div>
            )}
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
