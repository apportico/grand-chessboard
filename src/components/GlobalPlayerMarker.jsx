import { CircleMarker, Popup, Tooltip } from 'react-leaflet';

const CATEGORY_COLORS = {
  asset_manager: '#7048e8',
  sovereign_wealth: '#f59f00',
  state_corporation: '#e03131',
  private_conglomerate: '#1971c2',
  private_equity: '#9c36b5',
  tech_oligarch: '#0ea5e9',
  trading_house: '#2f9e44',
};

export const PLAYER_CATEGORY_COLORS = CATEGORY_COLORS;

const CATEGORY_LABELS = {
  asset_manager: 'Asset Manager',
  sovereign_wealth: 'Sovereign Wealth',
  state_corporation: 'State Corporation',
  private_conglomerate: 'Conglomerate',
  private_equity: 'Private Equity',
  tech_oligarch: 'Tech Oligarch',
  trading_house: 'Trading House',
};

const ALIGNMENT_BADGE = {
  western: { bg: '#1971c2', label: 'Western' },
  china: { bg: '#e03131', label: 'China' },
  russia: { bg: '#da3633', label: 'Russia' },
  mixed: { bg: '#f59f00', label: 'Multi-aligned' },
  india: { bg: '#e8590c', label: 'India' },
};

const STATUS_COLORS = {
  dominant: '#7048e8',
  expanding: '#0ea5e9',
  active: '#2f9e44',
  declining: '#f59f00',
};

export default function GlobalPlayerMarker({ player }) {
  const color = CATEGORY_COLORS[player.category] || '#868e96';
  const alignBadge = ALIGNMENT_BADGE[player.alignment] || { bg: '#868e96', label: player.alignment };

  return (
    <>
      {/* Outer glow */}
      <CircleMarker
        center={[player.lat, player.lon]}
        radius={14}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.06,
          weight: 1,
          opacity: 0.12,
        }}
        interactive={false}
      />
      {/* Core */}
      <CircleMarker
        center={[player.lat, player.lon]}
        radius={7}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.45,
          weight: 2,
          opacity: 0.8,
        }}
      >
        <Tooltip direction="top" className="custom-tooltip" opacity={0.95}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{player.name}</span>
        </Tooltip>
        <Popup>
          <div style={{ maxWidth: 300, fontSize: 12, lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
              {player.name}
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
                {CATEGORY_LABELS[player.category] || player.category}
              </span>
              <span style={{
                backgroundColor: alignBadge.bg,
                color: '#fff',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                fontWeight: 600,
              }}>
                {alignBadge.label}
              </span>
              <span style={{
                backgroundColor: STATUS_COLORS[player.status] || '#868e96',
                color: '#fff',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                fontWeight: 600,
              }}>
                {player.status}
              </span>
            </div>

            <div style={{ color: '#666', marginBottom: 3 }}>
              <strong>HQ:</strong> {player.country}
            </div>
            <div style={{ color: '#666', marginBottom: 3 }}>
              <strong>Controller:</strong> {player.controller}
            </div>
            {player.aum && (
              <div style={{ color: '#666', marginBottom: 3 }}>
                <strong>AUM / Scale:</strong> {player.aum}
              </div>
            )}

            {player.holdings && player.holdings.length > 0 && (
              <div style={{ marginTop: 6, borderTop: '1px solid #eee', paddingTop: 6 }}>
                <strong style={{ fontSize: 11 }}>Key Holdings:</strong>
                <ul style={{ margin: '3px 0 0 14px', padding: 0 }}>
                  {player.holdings.slice(0, 5).map((h, i) => (
                    <li key={i} style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {player.infrastructure_footprint && (
              <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
                <strong>Infrastructure:</strong> {player.infrastructure_footprint}
              </div>
            )}

            {player.tag && (
              <div style={{ color: '#1971c2', fontWeight: 700, fontSize: 11, marginTop: 6 }}>
                {player.tag}
              </div>
            )}

            {player.alert && (
              <div style={{ color: '#c92a2a', fontWeight: 600, fontSize: 11, marginTop: 4, padding: '4px 6px', backgroundColor: '#fff5f5', borderRadius: 3 }}>
                {player.alert}
              </div>
            )}
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
