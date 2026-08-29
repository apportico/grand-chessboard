import { MapContainer, TileLayer, Polyline, Tooltip, CircleMarker, Popup } from 'react-leaflet';
import PortMarker from './PortMarker';
import ChokeMarker from './ChokeMarker';
import CorridorLine from './CorridorLine';
import MilitaryBaseMarker from './MilitaryBaseMarker';
import AssetMarker from './AssetMarker';
import PipelineLayer from './PipelineLayer';
import ResourceMarker from './ResourceMarker';
import ConflictZoneLayer from './ConflictZoneLayer';
import SanctionsLayer from './SanctionsLayer';
import NavalMarker from './NavalMarker';
import RegimeChangeMarker from './RegimeChangeMarker';
import AllianceMarker from './AllianceMarker';
import OffshoreZoneMarker from './OffshoreZoneMarker';
import GlobalPlayerMarker from './GlobalPlayerMarker';
import StatePlayerMarker from './StatePlayerMarker';

const MAP_CENTER = [25, 45];
const MAP_ZOOM = 3;
const MAP_MIN_ZOOM = 2;

// Esri's light gray canvas: free, no API key, and desaturated enough that the
// corridors and markers carry the colour. CARTO's basemaps now require a key
// and watermark every tile without one.
const BASE_TILE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const LABEL_TILE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
const ATTRIBUTION = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>';

export default function Map({
  ports, chokepoints, corridors, visibleCorridors,
  militaryBases, strategicAssets,
  energyPipelines, miningMaterials, energyInfrastructure,
  militaryConflicts, sanctionsRegimes, navalDeployments, regimeChanges,
  goldDiamonds, foodGrain, submarineCables, waterInfrastructure,
  financialWarfare, armsDeals, spaceAssets, cyberInfrastructure,
  shippingLanes, treatiesAlliances, offshoreZones, globalPlayers,
  statePlayers,
  transportInfrastructure,
  layers,
}) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      maxZoom={10}
      className="w-full h-full"
      style={{ background: '#f8fafc' }}
      zoomControl={false}
    >
      <TileLayer url={BASE_TILE} attribution={ATTRIBUTION} />

      {/* Conflict Zones (lowest layer — background) */}
      {layers.conflicts && militaryConflicts.map((c) => (
        <ConflictZoneLayer key={c.id} conflict={c} />
      ))}

      {/* Sanctions (dashed circles around target countries) */}
      {layers.sanctions && sanctionsRegimes.map((s) => (
        <SanctionsLayer key={s.id} sanction={s} />
      ))}

      {/* Energy Pipelines (below corridors) */}
      {layers.energyPipelines && energyPipelines.map((p) => (
        <PipelineLayer key={p.id} pipeline={p} />
      ))}

      {/* Corridors */}
      {layers.corridors && corridors
        .filter((c) => visibleCorridors.has(c.id))
        .map((corridor) => (
          <CorridorLine key={corridor.id} corridor={corridor} />
        ))}

      {/* Chokepoints */}
      {layers.chokepoints && chokepoints.map((chokepoint) => (
        <ChokeMarker key={chokepoint.id} chokepoint={chokepoint} />
      ))}

      {/* Ports */}
      {layers.ports && ports
        .filter((port) => port.lat != null && port.lon != null)
        .map((port) => (
          <PortMarker key={port.name} port={port} />
        ))}

      {/* Energy Infrastructure */}
      {layers.energyInfra && energyInfrastructure.map((r, i) => (
        <ResourceMarker key={`ei-${r.name}-${i}`} resource={r} />
      ))}

      {/* Mining & Materials */}
      {layers.mining && miningMaterials.map((r, i) => (
        <ResourceMarker key={`mm-${r.name}-${i}`} resource={r} />
      ))}

      {/* Military Bases */}
      {layers.militaryBases && militaryBases.map((base, i) => (
        <MilitaryBaseMarker key={`mil-${base.name}-${i}`} base={base} />
      ))}

      {/* Strategic Assets */}
      {layers.strategicAssets && strategicAssets.map((asset, i) => (
        <AssetMarker key={`asset-${asset.name}-${i}`} asset={asset} />
      ))}

      {/* Naval Deployments */}
      {layers.naval && navalDeployments.map((d, i) => (
        <NavalMarker key={`nav-${d.id}-${i}`} deployment={d} />
      ))}

      {/* Regime Changes */}
      {layers.regimeChanges && regimeChanges.map((r, i) => (
        <RegimeChangeMarker key={`rc-${r.id}-${i}`} change={r} />
      ))}

      {/* Gold & Diamonds */}
      {layers.goldDiamonds && goldDiamonds.map((r, i) => (
        <ResourceMarker key={`gd-${r.name}-${i}`} resource={r} />
      ))}

      {/* Food & Grain */}
      {layers.foodGrain && foodGrain.map((r, i) => (
        <ResourceMarker key={`fg-${r.name}-${i}`} resource={r} />
      ))}

      {/* Water Infrastructure */}
      {layers.waterInfrastructure && waterInfrastructure.map((r, i) => (
        <ResourceMarker key={`wi-${r.name}-${i}`} resource={r} />
      ))}

      {/* Financial Warfare */}
      {layers.financialWarfare && financialWarfare.map((r, i) => (
        <ResourceMarker key={`fw-${r.name}-${i}`} resource={r} />
      ))}

      {/* Arms Deals */}
      {layers.armsDeals && armsDeals.map((r, i) => (
        <ResourceMarker key={`ad-${r.name}-${i}`} resource={r} />
      ))}

      {/* Space Assets */}
      {layers.spaceAssets && spaceAssets.map((r, i) => (
        <ResourceMarker key={`sa-${r.name}-${i}`} resource={r} />
      ))}

      {/* Cyber Infrastructure */}
      {layers.cyberInfrastructure && cyberInfrastructure.map((r, i) => (
        <ResourceMarker key={`ci-${r.name}-${i}`} resource={r} />
      ))}

      {/* Treaties & Alliances */}
      {layers.treatiesAlliances && treatiesAlliances.map((r, i) => (
        <AllianceMarker key={`ta-${r.name}-${i}`} alliance={r} />
      ))}

      {/* Offshore Zones */}
      {layers.offshoreZones && offshoreZones.map((z, i) => (
        <OffshoreZoneMarker key={`ofz-${z.id}-${i}`} zone={z} />
      ))}

      {/* Global Players */}
      {layers.globalPlayers && globalPlayers.map((p, i) => (
        <GlobalPlayerMarker key={`gp-${p.id}-${i}`} player={p} />
      ))}

      {/* State Players (countries) */}
      {layers.statePlayers && statePlayers.map((p, i) => (
        <StatePlayerMarker key={`sp-${p.id}-${i}`} player={p} allPlayers={statePlayers} />
      ))}

      {/* Submarine Cables */}
      {layers.submarineCables && submarineCables.filter(c => c.waypoints && c.waypoints.length).map((cable, i) => (
        <Polyline key={`cable-${i}`} positions={cable.waypoints} color={cable.color || '#1971c2'} weight={2} opacity={0.6} dashArray="4 4">
          <Tooltip>{cable.name}</Tooltip>
        </Polyline>
      ))}
      {layers.submarineCables && submarineCables.filter(c => c.lat != null && (!c.waypoints || !c.waypoints.length)).map((c, i) => (
        <ResourceMarker key={`cable-pt-${i}`} resource={c} />
      ))}

      {/* Transport Infrastructure — lines (railways, highways, bridges with waypoints) */}
      {layers.transportInfra && transportInfrastructure.filter(t => t.waypoints && t.waypoints.length).map((t, i) => {
        const weight = t.category === 'railway' ? 3 : t.category === 'highway' ? 2.5 : 2;
        const dashArray = t.dash ? '6 4' : t.category === 'highway' ? '2 4' : undefined;
        return (
          <Polyline key={`transport-line-${i}`} positions={t.waypoints} color={t.color || '#6b7280'} weight={weight} opacity={0.7} dashArray={dashArray}>
            <Tooltip sticky>
              <div style={{ maxWidth: 260 }}>
                <strong>{t.name}</strong><br/>
                <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{t.category.replace(/_/g, ' ')} — {t.corridor.replace(/_/g, ' ')}</span><br/>
                <span style={{ fontSize: 11, color: '#666' }}>Status: {t.status.replace(/_/g, ' ')}</span>
                {t.tag && <><br/><span style={{ fontSize: 10, color: '#e03131', fontWeight: 600 }}>{t.tag}</span></>}
              </div>
            </Tooltip>
          </Polyline>
        );
      })}

      {/* Transport Infrastructure — point markers (border crossings, logistics hubs without waypoints) */}
      {layers.transportInfra && transportInfrastructure.filter(t => t.lat != null && t.lon != null && (!t.waypoints || !t.waypoints.length)).map((t, i) => {
        const catColor = { border_crossing: '#2f9e44', logistics_hub: '#0ea5e9', bridge: '#7048e8' }[t.category] || t.color || '#6b7280';
        return (
          <CircleMarker key={`transport-pt-${i}`} center={[t.lat, t.lon]} radius={6} fillColor={catColor} color="#fff" weight={1.5} fillOpacity={0.85}>
            <Popup>
              <div style={{ maxWidth: 280 }}>
                <strong>{t.name}</strong><br/>
                <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{t.category.replace(/_/g, ' ')} — {t.corridor.replace(/_/g, ' ')}</span><br/>
                <span style={{ fontSize: 11 }}>Status: {t.status.replace(/_/g, ' ')}</span><br/>
                {t.operator && <><span style={{ fontSize: 11, color: '#555' }}>{t.operator}</span><br/></>}
                {t.capacity && <><span style={{ fontSize: 11, color: '#555' }}>{t.capacity}</span><br/></>}
                {t.strategic_value && <><br/><span style={{ fontSize: 11 }}>{t.strategic_value}</span></>}
                {t.alert && <><br/><span style={{ fontSize: 11, color: '#e03131', fontWeight: 600 }}>{t.alert}</span></>}
                {t.tag && <><br/><span style={{ fontSize: 10, color: '#7048e8', fontWeight: 700 }}>{t.tag}</span></>}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Shipping Lanes */}
      {layers.shippingLanes && shippingLanes.filter(s => s.waypoints && s.waypoints.length).map((lane, i) => (
        <Polyline key={`ship-${i}`} positions={lane.waypoints} color={lane.color || '#0ea5e9'} weight={3} opacity={0.5} dashArray="8 6">
          <Tooltip>{lane.name} — {lane.traffic_volume}</Tooltip>
        </Polyline>
      ))}

      {/* Labels on top */}
      <TileLayer url={LABEL_TILE} />
    </MapContainer>
  );
}
