import { CircleMarker, Popup, Tooltip } from 'react-leaflet';

const CHOKE_COLOR = '#ff6b6b';

export default function ChokeMarker({ chokepoint }) {
  return (
    <>
      {/* Outer pulse ring */}
      <CircleMarker
        center={[chokepoint.lat, chokepoint.lon]}
        radius={16}
        pathOptions={{
          color: CHOKE_COLOR,
          fillColor: CHOKE_COLOR,
          fillOpacity: 0.06,
          weight: 1,
          opacity: 0.3,
        }}
        className="choke-pulse"
      />
      {/* Inner ring */}
      <CircleMarker
        center={[chokepoint.lat, chokepoint.lon]}
        radius={7}
        pathOptions={{
          color: CHOKE_COLOR,
          fillColor: CHOKE_COLOR,
          fillOpacity: 0.25,
          weight: 1.5,
          opacity: 0.8,
        }}
      >
        <Tooltip direction="top" offset={[0, -8]} className="choke-tooltip">
          <span className="font-semibold text-xs">{chokepoint.name}</span>
        </Tooltip>
        <Popup maxWidth={240}>
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-sm mb-1" style={{ color: CHOKE_COLOR }}>{chokepoint.name}</p>
            <p className="mb-1"><span className="opacity-60">Control:</span> {chokepoint.controller}</p>
            <p><span className="opacity-60">Traffic:</span> {chokepoint.traffic}</p>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
