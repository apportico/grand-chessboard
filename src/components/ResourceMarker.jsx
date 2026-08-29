import L from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';

export const CATEGORY_COLORS = {
  // Mining
  uranium: '#22c55e',
  rare_earth: '#a855f7',
  lithium: '#06b6d4',
  cobalt: '#3b82f6',
  copper: '#f97316',
  steel: '#6b7280',
  semiconductor: '#ec4899',
  aluminum: '#94a3b8',
  nickel: '#84cc16',
  iron_ore: '#b45309',
  // Energy infrastructure
  refinery: '#ef4444',
  lng_terminal: '#0ea5e9',
  oil_field: '#b91c1c',
  gas_field: '#0891b2',
  oil_gas_field: '#dc2626',
  nuclear: '#facc15',
  // Gold & Diamonds
  gold_mine: '#f59f00',
  gold_reserve: '#fab005',
  gold_route: '#e8590c',
  diamond_mine: '#b197fc',
  diamond_processing: '#9775fa',
  diamond_lab: '#845ef7',
  // Food & Grain
  grain_terminal: '#74b816',
  grain_route: '#82c91e',
  fertilizer: '#5c940d',
  food_chokepoint: '#e03131',
  strategic_reserve: '#f59f00',
  water_food: '#228be6',
  // Water
  dam: '#1971c2',
  river_system: '#22b8cf',
  water_treaty: '#0c8599',
  water_crisis: '#e03131',
  // Financial
  payment_system: '#7048e8',
  currency_deal: '#9c36b5',
  sovereign_fund: '#f59f00',
  sanctions_tool: '#e03131',
  evasion_network: '#e8590c',
  // Arms
  arms_deal: '#e03131',
  weapons_transfer: '#da3633',
  military_aid: '#1971c2',
  technology_transfer: '#7048e8',
  // Space
  navigation: '#1971c2',
  constellation: '#0ea5e9',
  launch_site: '#e8590c',
  space_weapon: '#e03131',
  ground_station: '#2f9e44',
  // Cyber
  '5g_network': '#7048e8',
  data_center: '#1971c2',
  surveillance: '#e03131',
  cyber_operation: '#da3633',
  digital_policy: '#f59f00',
  // Treaties
  military_alliance: '#1971c2',
  economic_bloc: '#2f9e44',
  bilateral_deal: '#7048e8',
  intelligence: '#e03131',
  collapsed: '#868e96',
  // Cable types
  cable_system: '#0ea5e9',
  landing_station: '#1971c2',
  cable_chokepoint: '#e03131',
  cable_event: '#f59f00',
  // Shipping
  shipping_lane: '#0ea5e9',
  trade_route: '#1971c2',
  diversion_route: '#e8590c',
};

const CATEGORY_ICONS = {
  uranium: '☢',
  rare_earth: '⬡',
  lithium: '⚡',
  cobalt: '◈',
  copper: '◆',
  steel: '▬',
  semiconductor: '◻',
  aluminum: '△',
  nickel: '◇',
  refinery: '⛽',
  lng_terminal: '🔷',
  oil_field: '●',
  gas_field: '●',
  nuclear: '⚛',
  gold_mine: '⬡',
  gold_reserve: '🏦',
  diamond_mine: '◇',
  grain_terminal: '🌾',
  fertilizer: '⬡',
  dam: '▬',
  river_system: '〰',
  payment_system: '$',
  arms_deal: '⚔',
  navigation: '◎',
  constellation: '✦',
  launch_site: '▲',
  '5g_network': '📡',
  data_center: '▣',
  surveillance: '◉',
  military_alliance: '⚑',
  economic_bloc: '⊞',
  cable_system: '〰',
  landing_station: '⊕',
  shipping_lane: '⇢',
};

function createIcon(category) {
  const color = CATEGORY_COLORS[category] || '#6b7280';
  return L.divIcon({
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<svg width="14" height="14" viewBox="0 0 14 14">
      <polygon points="7,1 13,7 7,13 1,7" fill="${color}" stroke="#ffffff" stroke-width="1.2" opacity="0.85"/>
    </svg>`,
  });
}

export default function ResourceMarker({ resource }) {
  const category = resource.category;
  const color = CATEGORY_COLORS[category] || '#6b7280';

  return (
    <Marker
      position={[resource.lat, resource.lon]}
      icon={createIcon(category)}
    >
      <Tooltip direction="top" offset={[0, -8]}>
        <span className="font-semibold text-xs">{resource.name}</span>
      </Tooltip>
      <Popup maxWidth={280}>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-sm mb-0.5" style={{ color }}>{resource.name}</p>
          <p className="text-gray-400 text-[11px] mb-1">{resource.country}</p>

          <div className="flex gap-1 mb-2 flex-wrap">
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white capitalize"
              style={{ backgroundColor: color }}
            >
              {(category || '').replace(/_/g, ' ')}
            </span>
          </div>

          {(resource.owner || resource.controller || resource.operator || resource.seller) && (
            <div className="mb-1">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Owner</span>
              <p className="text-[11px] leading-snug mt-0.5">{resource.owner || resource.controller || resource.operator || resource.seller}</p>
            </div>
          )}

          {(resource.production || resource.capacity || resource.description || resource.strategic_value || resource.value || resource.capability || resource.downstream_impact || resource.corridor_impact) && (
            <div className="mb-1">
              <span className="font-semibold text-[10px] uppercase tracking-wide opacity-60">Details</span>
              <p className="text-[11px] leading-snug mt-0.5">
                {resource.production || resource.capacity || resource.description || resource.strategic_value || resource.value || resource.capability || resource.downstream_impact || resource.corridor_impact}
              </p>
            </div>
          )}

          {resource.tag && (
            <p className="text-[11px] italic opacity-70 mt-1">{resource.tag}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
