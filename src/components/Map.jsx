import { MapContainer, TileLayer } from 'react-leaflet';
import PortMarker from './PortMarker';
import ChokeMarker from './ChokeMarker';
import CorridorLine from './CorridorLine';
import MilitaryBaseMarker from './MilitaryBaseMarker';
import AssetMarker from './AssetMarker';
import PipelineLayer from './PipelineLayer';
import ResourceMarker from './ResourceMarker';

const MAP_CENTER = [25, 45];
const MAP_ZOOM = 3;
const MAP_MIN_ZOOM = 2;

const BASE_TILE = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const LABEL_TILE = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function Map({
  ports, chokepoints, corridors, visibleCorridors,
  militaryBases, strategicAssets,
  energyPipelines, miningMaterials, energyInfrastructure,
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

      {/* Labels on top */}
      <TileLayer url={LABEL_TILE} />
    </MapContainer>
  );
}
