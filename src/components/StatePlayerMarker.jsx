import { CircleMarker, Polyline, Popup, Tooltip } from 'react-leaflet';

export const TIER_COLORS = {
  principal: '#e03131',
  regional_power: '#f59f00',
  swing_state: '#7048e8',
  satellite: '#868e96',
  contested: '#e8590c',
};

export const BLOC_COLORS = {
  BUILDER: '#1971c2',
  BLOCKER: '#e03131',
  SWING: '#f59f00',
};

const TIER_LABELS = {
  principal: 'Principal Power',
  regional_power: 'Regional Power',
  swing_state: 'Swing State',
  satellite: 'Satellite',
  contested: 'Contested Zone',
};

const TIER_SIZES = {
  principal: { core: 11, glow: 20 },
  regional_power: { core: 8, glow: 15 },
  swing_state: { core: 7, glow: 13 },
  satellite: { core: 5, glow: 10 },
  contested: { core: 7, glow: 14 },
};

function getBlocColor(bloc) {
  return BLOC_COLORS[bloc] || '#868e96';
}

function SatelliteLink({ from, to }) {
  if (!from || !to || from.lat == null || to.lat == null) return null;
  return (
    <Polyline
      positions={[[from.lat, from.lon], [to.lat, to.lon]]}
      pathOptions={{
        color: '#868e96',
        weight: 1,
        opacity: 0.25,
        dashArray: '3 4',
      }}
      interactive={false}
    />
  );
}

function ListSection({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: 6, borderTop: '1px solid #eee', paddingTop: 6 }}>
      <strong style={{ fontSize: 11 }}>{title}:</strong>
      <ul style={{ margin: '3px 0 0 14px', padding: 0 }}>
        {items.slice(0, 6).map((item, i) => (
          <li key={i} style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>{item}</li>
        ))}
        {items.length > 6 && (
          <li style={{ fontSize: 10, color: '#999' }}>+ {items.length - 6} more</li>
        )}
      </ul>
    </div>
  );
}

export default function StatePlayerMarker({ player, allPlayers }) {
  const tier = player.tier;
  const tierColor = TIER_COLORS[tier] || '#868e96';
  const blocColor = getBlocColor(player.bloc);
  const sizes = TIER_SIZES[tier] || TIER_SIZES.satellite;

  // For contested zones, use orange pulsing style
  const isContested = tier === 'contested';
  const coreOpacity = isContested ? 0.3 : 0.5;

  return (
    <>
      {/* Outer glow ring — colored by bloc */}
      <CircleMarker
        center={[player.lat, player.lon]}
        radius={sizes.glow}
        pathOptions={{
          color: blocColor,
          fillColor: blocColor,
          fillOpacity: isContested ? 0.08 : 0.06,
          weight: isContested ? 2 : 1,
          opacity: isContested ? 0.3 : 0.15,
          dashArray: isContested ? '4 3' : undefined,
        }}
        interactive={false}
      />
      {/* Core dot — colored by tier */}
      <CircleMarker
        center={[player.lat, player.lon]}
        radius={sizes.core}
        pathOptions={{
          color: tierColor,
          fillColor: tierColor,
          fillOpacity: coreOpacity,
          weight: 2,
          opacity: 0.8,
        }}
      >
        <Tooltip direction="top" className="custom-tooltip" opacity={0.95}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>
            {player.flag_emoji || ''} {player.name}
          </span>
        </Tooltip>
        <Popup>
          <div style={{ maxWidth: 320, fontSize: 12, lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
              {player.flag_emoji || ''} {player.name}
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: tierColor,
                color: '#fff',
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                fontWeight: 600,
              }}>
                {TIER_LABELS[tier] || tier}
              </span>
              {player.bloc && (
                <span style={{
                  backgroundColor: blocColor,
                  color: '#fff',
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 3,
                  fontWeight: 600,
                }}>
                  {player.bloc}
                </span>
              )}
            </div>

            {/* Principal / Regional Power details */}
            {player.official_doctrine && (
              <ListSection title="Official Doctrine" items={player.official_doctrine} />
            )}
            {player.goals && (
              <ListSection title="Strategic Goals" items={player.goals} />
            )}
            {player.tools && (
              <ListSection title="Tools & Leverage" items={player.tools} />
            )}
            {player.vulnerabilities && (
              <ListSection title="Vulnerabilities" items={player.vulnerabilities} />
            )}
            {player.corridors && (
              <ListSection title="Corridors" items={player.corridors} />
            )}

            {/* Regional power extras */}
            {player.leans_toward && (
              <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
                <strong>Leans toward:</strong> {player.leans_toward}
              </div>
            )}
            {player.satellites && player.satellites.length > 0 && (
              <ListSection title="Satellites" items={player.satellites} />
            )}

            {/* Swing state details */}
            {player.leverage && (
              <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
                <strong>Leverage:</strong> {player.leverage}
              </div>
            )}
            {player.plays_both && (
              <div style={{ color: '#555', marginTop: 4, fontSize: 11 }}>
                <strong>Plays both sides:</strong> {player.plays_both}
              </div>
            )}

            {/* Satellite details */}
            {player.patron && (
              <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
                <strong>Patron:</strong> {player.patron}
              </div>
            )}
            {player.role && (
              <div style={{ color: '#555', marginTop: 4, fontSize: 11 }}>
                <strong>Role:</strong> {player.role}
              </div>
            )}

            {/* Contested zone details */}
            {player.status && tier === 'contested' && (
              <div style={{ color: '#555', marginTop: 6, fontSize: 11, borderTop: '1px solid #eee', paddingTop: 6 }}>
                <strong>Status:</strong> {player.status}
              </div>
            )}
            {player.contested_by && (
              <ListSection title="Contested by" items={player.contested_by} />
            )}
            {player.corridor_impact && (
              <div style={{ color: '#1971c2', fontWeight: 700, fontSize: 11, marginTop: 6 }}>
                {player.corridor_impact}
              </div>
            )}
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
