import { useState, useMemo } from 'react';
import { ALIGNMENT_COLORS, CONFLICT_COLORS, SANCTIONS_COLORS, NAVAL_COLORS, REGIME_COLORS } from '../utils/colors';
import { OPERATOR_COLORS, OPERATOR_FLAGS } from './MilitaryBaseMarker';
import { OWNER_COLORS } from './AssetMarker';
import { PLAYER_CATEGORY_COLORS } from './GlobalPlayerMarker';
import { TIER_COLORS, BLOC_COLORS } from './StatePlayerMarker';

const ALLIANCE_TYPE_COLORS = {
  military_alliance: '#1971c2',
  economic_bloc: '#2f9e44',
  bilateral_deal: '#7048e8',
  intelligence: '#e03131',
  energy_partnership: '#e8590c',
  financial_partnership: '#f59f00',
  technology_partnership: '#ec4899',
  maritime_security: '#0ea5e9',
  infrastructure_pact: '#0d9488',
};

const TEAM_META = {
  BLOCKER: { label: 'Blocker', color: '#f85149' },
  BUILDER: { label: 'Builder', color: '#58a6ff' },
  MIXED: { label: 'Mixed', color: '#d29922' },
};

const ALIGNMENT_LABELS = {
  china: 'China-controlled',
  western: 'Western-operated',
  india: 'India-operated',
  uae: 'UAE-operated',
  state: 'State-owned',
  mixed: 'Mixed / Contested',
  strategic: 'Strategic',
  russia: 'Russia',
};

const LAYER_CONFIG = [
  { key: 'corridors', label: 'Corridors', icon: '─' },
  { key: 'ports', label: 'Ports', icon: '●' },
  { key: 'chokepoints', label: 'Chokepoints', icon: '◎' },
  { key: 'conflicts', label: 'Conflict Zones', icon: '⊘' },
  { key: 'sanctions', label: 'Sanctions', icon: '⊗' },
  { key: 'naval', label: 'Naval Forces', icon: '▲' },
  { key: 'regimeChanges', label: 'Regime Changes', icon: '★' },
  { key: 'militaryBases', label: 'Military Bases', icon: '◆' },
  { key: 'strategicAssets', label: 'Strategic Assets', icon: '■' },
  { key: 'energyPipelines', label: 'Energy Pipelines', icon: '~' },
  { key: 'energyInfra', label: 'Energy Infrastructure', icon: '⛽' },
  { key: 'mining', label: 'Mining & Materials', icon: '⬡' },
  { key: 'goldDiamonds', label: 'Gold & Diamonds', icon: '💎' },
  { key: 'foodGrain', label: 'Food & Grain', icon: '🌾' },
  { key: 'submarineCables', label: 'Submarine Cables', icon: '〰' },
  { key: 'waterInfrastructure', label: 'Water', icon: '💧' },
  { key: 'financialWarfare', label: 'Financial Warfare', icon: '$' },
  { key: 'armsDeals', label: 'Arms Deals', icon: '⚔' },
  { key: 'spaceAssets', label: 'Space Assets', icon: '🛰' },
  { key: 'cyberInfrastructure', label: 'Cyber', icon: '🔒' },
  { key: 'shippingLanes', label: 'Shipping Lanes', icon: '🚢' },
  { key: 'treatiesAlliances', label: 'Treaties', icon: '📜' },
  { key: 'offshoreZones', label: 'Offshore Zones', icon: '🏝' },
  { key: 'globalPlayers', label: 'Global Players', icon: '🏛' },
  { key: 'statePlayers', label: 'State Players', icon: '🏴' },
  { key: 'transportInfra', label: 'Transport Infra', icon: '🛤' },
];

const OWNER_PRESETS = [
  { label: 'COSCO', query: 'cosco' },
  { label: 'China Merchants', query: 'china merchants' },
  { label: 'DP World', query: 'dp world' },
  { label: 'APM / Maersk', query: 'apm terminals' },
  { label: 'Hutchison', query: 'hutchison' },
  { label: 'PSA', query: 'psa' },
  { label: 'Adani', query: 'adani' },
  { label: 'CMA CGM', query: 'cma cgm' },
];

function getPortSearchText(port) {
  const parts = [port.name || '', port.operator || '', port.tag || '', port.country || '', port.location || ''];
  if (port.details && typeof port.details === 'object') Object.values(port.details).forEach(v => parts.push(v));
  return parts.join(' ').toLowerCase();
}

function getBaseSearchText(base) {
  return [base.name, base.country, base.operator, base.type, base.status, base.tag].join(' ').toLowerCase();
}

function getAssetSearchText(asset) {
  return [asset.name, asset.country, asset.owner, asset.category, asset.subcategory, asset.description, asset.tag].join(' ').toLowerCase();
}

export function applyPortFilters(ports, filters) {
  if (!filters.alignments.size && !filters.corridorId && !filters.search) return ports;
  return ports.filter(p => {
    if (filters.alignments.size > 0 && !filters.alignments.has(p.alignment)) return false;
    if (filters.corridorId && !(p.corridors || []).includes(filters.corridorId)) return false;
    if (filters.search && !getPortSearchText(p).includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyMilitaryFilters(bases, filters) {
  if (!filters.militaryOperators.size && !filters.search) return bases;
  return bases.filter(b => {
    if (filters.militaryOperators.size > 0 && !filters.militaryOperators.has(b.operator)) return false;
    if (filters.search && !getBaseSearchText(b).includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyAssetFilters(assets, filters) {
  if (!filters.assetOwners.size && !filters.assetCategories.size && !filters.search) return assets;
  return assets.filter(a => {
    if (filters.assetOwners.size > 0 && !filters.assetOwners.has(a.owner)) return false;
    if (filters.assetCategories.size > 0 && !filters.assetCategories.has(a.category)) return false;
    if (filters.search && !getAssetSearchText(a).includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyConflictFilters(conflicts, filters) {
  if (!filters.conflictTypes.size && !filters.conflictStatuses.size && !filters.search) return conflicts;
  return conflicts.filter(c => {
    if (filters.conflictTypes.size > 0 && !filters.conflictTypes.has(c.type)) return false;
    if (filters.conflictStatuses.size > 0 && !filters.conflictStatuses.has(c.status)) return false;
    if (filters.search && ![c.name, c.description, ...(c.parties || [])].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applySanctionFilters(sanctions, filters) {
  if (!filters.sanctionStatuses.size && !filters.sanctionTypes.size && !filters.search) return sanctions;
  return sanctions.filter(s => {
    if (filters.sanctionStatuses.size > 0 && !filters.sanctionStatuses.has(s.status)) return false;
    if (filters.sanctionTypes.size > 0 && !filters.sanctionTypes.has(s.type)) return false;
    if (filters.search && ![s.name, s.target_country, s.imposer, s.description].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyNavalFilters(deployments, filters) {
  if (!filters.navalOperators.size && !filters.navalForceTypes.size && !filters.search) return deployments;
  return deployments.filter(d => {
    if (filters.navalOperators.size > 0 && !filters.navalOperators.has(d.operator)) return false;
    if (filters.navalForceTypes.size > 0 && !filters.navalForceTypes.has(d.force_type)) return false;
    if (filters.search && ![d.name, d.operator, d.mission, d.home_port].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyRegimeFilters(changes, filters) {
  if (!filters.regimeTypes.size && !filters.regimeAlignments.size && !filters.search) return changes;
  return changes.filter(r => {
    if (filters.regimeTypes.size > 0 && !filters.regimeTypes.has(r.type)) return false;
    if (filters.regimeAlignments.size > 0 && !filters.regimeAlignments.has(r.new_alignment)) return false;
    if (filters.search && ![r.name, r.country, r.significance, r.description].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

const STATUS_COLORS = {
  active: '#e03131',
  frozen: '#f59f00',
  ended: '#868e96',
  lifted: '#2f9e44',
  suspended: '#f59f00',
  partial: '#e8590c',
  permanent: '#2f9e44',
  deployed: '#1971c2',
  rotational: '#f59f00',
  contested: '#e03131',
  controlled: '#2f9e44',
  operational: '#2f9e44',
  stalled: '#f59f00',
  planned: '#868e96',
  sabotaged: '#7048e8',
  decommissioned: '#495057',
};

const ENERGY_CATEGORY_LABELS = {
  refinery: 'Refinery',
  lng_terminal: 'LNG Terminal',
  oil_gas_field: 'Oil/Gas Field',
  nuclear: 'Nuclear',
};

const MINING_CATEGORY_COLORS = {
  uranium: '#2f9e44',
  rare_earth: '#7048e8',
  lithium: '#22b8cf',
  cobalt: '#1971c2',
  copper: '#e8590c',
  iron_ore: '#868e96',
  nickel: '#74b816',
  aluminum: '#adb5bd',
  steel: '#495057',
  semiconductor: '#9c36b5',
};

// Derive simple pipeline status tag from long description
function getPipelineStatusTag(status) {
  if (!status) return 'unknown';
  const s = status.toLowerCase();
  if (s.includes('sabotage')) return 'sabotaged';
  if (s.includes('decommission')) return 'decommissioned';
  if (s.includes('stalled') || s.includes('incomplete')) return 'stalled';
  if (s.includes('planned') || s.includes('negotiation') || s.includes('proposed')) return 'planned';
  if (s.includes('partial') || s.includes('intermittent') || s.includes('limited') || s.includes('reduced')) return 'partial';
  if (s.includes('under construction')) return 'planned';
  if (s.includes('operational')) return 'operational';
  return 'other';
}

// Derive chokepoint control status
function getChokeStatus(controller) {
  if (!controller) return 'unknown';
  const c = controller.toLowerCase();
  if (c.includes('contested') || c.includes('closed') || c.includes('attack')) return 'contested';
  return 'controlled';
}

export function applyPipelineFilters(pipelines, filters) {
  if (!filters.pipelineTypes.size && !filters.pipelineStatuses.size && !filters.search) return pipelines;
  return pipelines.filter(p => {
    if (filters.pipelineTypes.size > 0 && !filters.pipelineTypes.has(p.type)) return false;
    if (filters.pipelineStatuses.size > 0 && !filters.pipelineStatuses.has(getPipelineStatusTag(p.status))) return false;
    if (filters.search && ![p.name, p.operator, p.controller, p.status].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyEnergyInfraFilters(infra, filters) {
  if (!filters.energyCategories.size && !filters.energyCountries.size && !filters.search) return infra;
  return infra.filter(i => {
    if (filters.energyCategories.size > 0 && !filters.energyCategories.has(i.category)) return false;
    if (filters.energyCountries.size > 0 && !filters.energyCountries.has(i.country)) return false;
    if (filters.search && ![i.name, i.country, i.owner, i.category, i.description].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyMiningFilters(mining, filters) {
  if (!filters.miningCategories.size && !filters.miningCountries.size && !filters.search) return mining;
  return mining.filter(m => {
    if (filters.miningCategories.size > 0 && !filters.miningCategories.has(m.category)) return false;
    if (filters.miningCountries.size > 0 && !filters.miningCountries.has(m.country)) return false;
    if (filters.search && ![m.name, m.country, m.owner, m.category, m.tag].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyChokeFilters(chokepoints, filters) {
  if (!filters.chokeStatuses.size && !filters.search) return chokepoints;
  return chokepoints.filter(c => {
    if (filters.chokeStatuses.size > 0 && !filters.chokeStatuses.has(getChokeStatus(c.controller))) return false;
    if (filters.search && ![c.name, c.controller, c.traffic].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyGoldFilters(items, filters) {
  if (!filters.goldCategories.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.goldCategories.size > 0 && !filters.goldCategories.has(i.category)) return false;
    if (filters.search && ![i.name, i.country, i.owner, i.category, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyFoodFilters(items, filters) {
  if (!filters.foodCategories.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.foodCategories.size > 0 && !filters.foodCategories.has(i.category)) return false;
    if (filters.search && ![i.name, i.country, i.owner, i.category, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyCableFilters(items, filters) {
  if (!filters.cableTypes.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.cableTypes.size > 0 && !filters.cableTypes.has(i.type)) return false;
    if (filters.search && ![i.name, i.owner, i.builder, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyWaterFilters(items, filters) {
  if (!filters.waterTypes.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.waterTypes.size > 0 && !filters.waterTypes.has(i.type)) return false;
    if (filters.search && ![i.name, i.country, i.controller, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyFinanceFilters(items, filters) {
  if (!filters.financeTypes.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.financeTypes.size > 0 && !filters.financeTypes.has(i.type)) return false;
    if (filters.search && ![i.name, i.country, i.controller, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyArmsFilters(items, filters) {
  if (!filters.armsSellerAlignments.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.armsSellerAlignments.size > 0 && !filters.armsSellerAlignments.has(i.seller_alignment)) return false;
    if (filters.search && ![i.name, i.seller, i.buyer, i.weapons, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applySpaceFilters(items, filters) {
  if (!filters.spaceTypes.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.spaceTypes.size > 0 && !filters.spaceTypes.has(i.type)) return false;
    if (filters.search && ![i.name, i.country, i.operator, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyCyberFilters(items, filters) {
  if (!filters.cyberTypes.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.cyberTypes.size > 0 && !filters.cyberTypes.has(i.type)) return false;
    if (filters.search && ![i.name, i.country, i.operator, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyShippingFilters(items, filters) {
  if (!filters.shippingStatuses.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.shippingStatuses.size > 0 && !filters.shippingStatuses.has(i.disruption_status)) return false;
    if (filters.search && ![i.name, i.controller, i.tag, i.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyAllianceFilters(items, filters) {
  if (!filters.allianceTypes.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.allianceTypes.size > 0 && !filters.allianceTypes.has(i.type)) return false;
    if (filters.search && ![i.name, i.type, i.corridor_impact, i.tag, ...(i.members || [])].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyOffshoreFilters(zones, filters) {
  if (!filters.offshoreCategories.size && !filters.offshoreStatuses.size && !filters.search) return zones;
  return zones.filter(z => {
    if (filters.offshoreCategories.size > 0 && !filters.offshoreCategories.has(z.category)) return false;
    if (filters.offshoreStatuses.size > 0 && !filters.offshoreStatuses.has(z.status)) return false;
    if (filters.search && ![z.name, z.controller, z.type, z.tag, z.strategic_value].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyGlobalPlayerFilters(players, filters) {
  if (!filters.playerCategories.size && !filters.playerAlignments.size && !filters.search) return players;
  return players.filter(p => {
    if (filters.playerCategories.size > 0 && !filters.playerCategories.has(p.category)) return false;
    if (filters.playerAlignments.size > 0 && !filters.playerAlignments.has(p.alignment)) return false;
    if (filters.search && ![p.name, p.controller, p.country, p.tag, p.strategic_value, ...(p.holdings || [])].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyStatePlayerFilters(players, filters) {
  if (!filters.stateTiers.size && !filters.stateBlocs.size && !filters.search) return players;
  return players.filter(p => {
    if (filters.stateTiers.size > 0 && !filters.stateTiers.has(p.tier)) return false;
    if (filters.stateBlocs.size > 0 && !filters.stateBlocs.has(p.bloc)) return false;
    if (filters.search && ![p.name, p.id, p.role, p.leverage, p.patron, ...(p.goals || []), ...(p.official_doctrine || [])].filter(Boolean).join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

export function applyTransportFilters(items, filters) {
  if (!filters.transportCategories.size && !filters.transportCorridors.size && !filters.transportStatuses.size && !filters.search) return items;
  return items.filter(i => {
    if (filters.transportCategories.size > 0 && !filters.transportCategories.has(i.category)) return false;
    if (filters.transportCorridors.size > 0 && !filters.transportCorridors.has(i.corridor)) return false;
    if (filters.transportStatuses.size > 0 && !filters.transportStatuses.has(i.status)) return false;
    if (filters.search && ![i.name, i.corridor, i.category, i.tag, i.strategic_value, ...(i.countries || [])].join(' ').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

const FORCE_TYPE_LABELS = {
  fleet: 'Fleet',
  carrier_group: 'Carrier Group',
  task_force: 'Task Force',
  naval_base: 'Naval Base',
  patrol: 'Patrol',
};

const ALIGNMENT_SHIFT_LABELS = {
  western: 'Western',
  russia: 'Russia',
  china: 'China',
  neutral: 'Neutral',
  contested: 'Contested',
  failed_state: 'Failed State',
  iran_influenced: 'Iran-aligned',
  taliban: 'Taliban',
  mixed: 'Mixed',
  state: 'State',
};

export default function MapSidebar({
  ports, corridors, militaryBases, strategicAssets,
  militaryConflicts = [], sanctionsRegimes = [], navalDeployments = [], regimeChanges = [],
  energyPipelines = [], energyInfrastructure = [], miningMaterials = [], chokepoints = [],
  goldDiamonds = [], foodGrain = [], submarineCables = [], waterInfrastructure = [],
  financialWarfare = [], armsDeals = [], spaceAssets = [], cyberInfrastructure = [],
  shippingLanes = [], treatiesAlliances = [], offshoreZones = [], globalPlayers = [],
  statePlayers = [],
  transportInfrastructure = [],
  moves = [], selectedYear = 2026,
  filters, onFiltersChange,
  layers, onLayerToggle,
}) {
  const [open, setOpen] = useState(false);

  const alignments = useMemo(() => {
    const set = new Set();
    ports.forEach(p => { if (p.alignment) set.add(p.alignment); });
    return [...set].sort();
  }, [ports]);

  const operators = useMemo(() => {
    const set = new Set();
    militaryBases.forEach(b => set.add(b.operator));
    return [...set].sort();
  }, [militaryBases]);

  const assetOwners = useMemo(() => {
    const set = new Set();
    strategicAssets.forEach(a => set.add(a.owner));
    return [...set].sort();
  }, [strategicAssets]);

  const assetCategories = useMemo(() => {
    const set = new Set();
    strategicAssets.forEach(a => { if (a.category) set.add(a.category); });
    return [...set].sort();
  }, [strategicAssets]);

  const corridorsByTeam = useMemo(() => {
    const grouped = { BLOCKER: [], BUILDER: [], MIXED: [] };
    corridors.forEach(c => {
      const team = c.team || 'MIXED';
      if (grouped[team]) grouped[team].push(c);
      else grouped.MIXED.push(c);
    });
    return grouped;
  }, [corridors]);

  // Dynamic tags from new layers
  const conflictTypes = useMemo(() => [...new Set(militaryConflicts.map(c => c.type))].sort(), [militaryConflicts]);
  const conflictStatuses = useMemo(() => [...new Set(militaryConflicts.map(c => c.status))].sort(), [militaryConflicts]);
  const sanctionStatuses = useMemo(() => [...new Set(sanctionsRegimes.map(s => s.status))].sort(), [sanctionsRegimes]);
  const sanctionTypes = useMemo(() => [...new Set(sanctionsRegimes.map(s => s.type))].sort(), [sanctionsRegimes]);
  const navalOps = useMemo(() => [...new Set(navalDeployments.map(d => d.operator))].sort(), [navalDeployments]);
  const navalForceTypes = useMemo(() => [...new Set(navalDeployments.map(d => d.force_type))].sort(), [navalDeployments]);
  const regimeTypes = useMemo(() => [...new Set(regimeChanges.map(r => r.type))].sort(), [regimeChanges]);
  const regimeNewAlignments = useMemo(() => [...new Set(regimeChanges.map(r => r.new_alignment))].sort(), [regimeChanges]);

  // Pipeline tags
  const pipelineTypes = useMemo(() => [...new Set(energyPipelines.map(p => p.type).filter(Boolean))].sort(), [energyPipelines]);
  const pipelineStatuses = useMemo(() => {
    const tags = new Set();
    energyPipelines.forEach(p => tags.add(getPipelineStatusTag(p.status)));
    return [...tags].sort();
  }, [energyPipelines]);

  // Energy infra tags
  const energyCategories = useMemo(() => [...new Set(energyInfrastructure.map(i => i.category).filter(Boolean))].sort(), [energyInfrastructure]);
  const energyCountries = useMemo(() => [...new Set(energyInfrastructure.map(i => i.country).filter(Boolean))].sort(), [energyInfrastructure]);

  // Mining tags
  const miningCategories = useMemo(() => [...new Set(miningMaterials.map(m => m.category).filter(Boolean))].sort(), [miningMaterials]);
  const miningCountries = useMemo(() => [...new Set(miningMaterials.map(m => m.country).filter(Boolean))].sort(), [miningMaterials]);

  // Chokepoint tags
  const chokeStatuses = useMemo(() => {
    const tags = new Set();
    chokepoints.forEach(c => tags.add(getChokeStatus(c.controller)));
    return [...tags].sort();
  }, [chokepoints]);

  // New layer tags
  const goldCategories = useMemo(() => [...new Set(goldDiamonds.map(g => g.category).filter(Boolean))].sort(), [goldDiamonds]);
  const foodCategories = useMemo(() => [...new Set(foodGrain.map(f => f.category).filter(Boolean))].sort(), [foodGrain]);
  const cableTypes = useMemo(() => [...new Set(submarineCables.map(c => c.type).filter(Boolean))].sort(), [submarineCables]);
  const waterTypes = useMemo(() => [...new Set(waterInfrastructure.map(w => w.type).filter(Boolean))].sort(), [waterInfrastructure]);
  const financeTypes = useMemo(() => [...new Set(financialWarfare.map(f => f.type).filter(Boolean))].sort(), [financialWarfare]);
  const armsSellerAlignments = useMemo(() => [...new Set(armsDeals.map(a => a.seller_alignment).filter(Boolean))].sort(), [armsDeals]);
  const spaceTypes = useMemo(() => [...new Set(spaceAssets.map(s => s.type).filter(Boolean))].sort(), [spaceAssets]);
  const cyberTypes = useMemo(() => [...new Set(cyberInfrastructure.map(c => c.type).filter(Boolean))].sort(), [cyberInfrastructure]);
  const shippingStatuses = useMemo(() => [...new Set(shippingLanes.map(s => s.disruption_status).filter(Boolean))].sort(), [shippingLanes]);
  const allianceTypes = useMemo(() => [...new Set(treatiesAlliances.map(t => t.type).filter(Boolean))].sort(), [treatiesAlliances]);
  const offshoreCategories = useMemo(() => [...new Set(offshoreZones.map(z => z.category).filter(Boolean))].sort(), [offshoreZones]);
  const offshoreStatuses = useMemo(() => [...new Set(offshoreZones.map(z => z.status).filter(Boolean))].sort(), [offshoreZones]);
  const playerCategories = useMemo(() => [...new Set(globalPlayers.map(p => p.category).filter(Boolean))].sort(), [globalPlayers]);
  const playerAlignments = useMemo(() => [...new Set(globalPlayers.map(p => p.alignment).filter(Boolean))].sort(), [globalPlayers]);
  const stateTiers = useMemo(() => [...new Set(statePlayers.map(p => p.tier).filter(Boolean))].sort(), [statePlayers]);
  const stateBlocs = useMemo(() => [...new Set(statePlayers.map(p => p.bloc).filter(Boolean))].sort(), [statePlayers]);

  const transportCategories = useMemo(() => [...new Set(transportInfrastructure.map(t => t.category).filter(Boolean))].sort(), [transportInfrastructure]);
  const transportCorridors = useMemo(() => [...new Set(transportInfrastructure.map(t => t.corridor).filter(Boolean))].sort(), [transportInfrastructure]);
  const transportStatuses = useMemo(() => [...new Set(transportInfrastructure.map(t => t.status).filter(Boolean))].sort(), [transportInfrastructure]);

  const hasActiveFilters = filters.alignments.size > 0 || filters.corridorId || filters.search ||
    filters.militaryOperators.size > 0 || filters.assetOwners.size > 0 || filters.assetCategories.size > 0 ||
    filters.conflictTypes.size > 0 || filters.conflictStatuses.size > 0 ||
    filters.sanctionStatuses.size > 0 || filters.sanctionTypes.size > 0 ||
    filters.navalOperators.size > 0 || filters.navalForceTypes.size > 0 ||
    filters.regimeTypes.size > 0 || filters.regimeAlignments.size > 0 ||
    filters.pipelineTypes.size > 0 || filters.pipelineStatuses.size > 0 ||
    filters.energyCategories.size > 0 || filters.energyCountries.size > 0 ||
    filters.miningCategories.size > 0 || filters.miningCountries.size > 0 ||
    filters.chokeStatuses.size > 0 ||
    filters.goldCategories.size > 0 || filters.foodCategories.size > 0 ||
    filters.cableTypes.size > 0 || filters.waterTypes.size > 0 ||
    filters.financeTypes.size > 0 || filters.armsSellerAlignments.size > 0 ||
    filters.spaceTypes.size > 0 || filters.cyberTypes.size > 0 ||
    filters.shippingStatuses.size > 0 || filters.allianceTypes.size > 0 ||
    filters.offshoreCategories.size > 0 || filters.offshoreStatuses.size > 0 ||
    filters.playerCategories.size > 0 || filters.playerAlignments.size > 0 ||
    filters.stateTiers.size > 0 || filters.stateBlocs.size > 0 ||
    filters.transportCategories.size > 0 || filters.transportCorridors.size > 0 || filters.transportStatuses.size > 0;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`bg-white/90 backdrop-blur text-gray-700 text-xs px-3 py-2 rounded-l-lg border border-r-0 border-gray-200 cursor-pointer hover:bg-gray-100/90 transition-colors flex items-center gap-1.5 ${
          hasActiveFilters ? 'ring-1 ring-blue-500' : ''
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="bg-blue-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">!</span>
        )}
      </button>
    );
  }

  const clearAll = () => onFiltersChange({
    alignments: new Set(), corridorId: null, search: '',
    militaryOperators: new Set(), assetOwners: new Set(), assetCategories: new Set(),
    conflictTypes: new Set(), conflictStatuses: new Set(),
    sanctionStatuses: new Set(), sanctionTypes: new Set(),
    navalOperators: new Set(), navalForceTypes: new Set(),
    regimeTypes: new Set(), regimeAlignments: new Set(),
    pipelineTypes: new Set(), pipelineStatuses: new Set(),
    energyCategories: new Set(), energyCountries: new Set(),
    miningCategories: new Set(), miningCountries: new Set(),
    chokeStatuses: new Set(),
    goldCategories: new Set(), foodCategories: new Set(),
    cableTypes: new Set(), waterTypes: new Set(),
    financeTypes: new Set(), armsSellerAlignments: new Set(),
    spaceTypes: new Set(), cyberTypes: new Set(),
    shippingStatuses: new Set(), allianceTypes: new Set(),
  });

  return (
    <div className="w-72 bg-white/95 backdrop-blur border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="text-xs font-semibold text-gray-700">Filters</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer">Clear all</button>
          )}
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer leading-none ml-1">&times;</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-4">

        {/* Scoreboard */}
        {(() => {
          const visible = moves.filter(m => m.year <= selectedYear);
          const blockerCount = visible.filter(m => m.side === 'BLOCKER').length;
          const builderCount = visible.filter(m => m.side === 'BUILDER').length;
          const mixedCount = visible.filter(m => m.side === 'MIXED').length;
          return (
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Score — {selectedYear}</label>
              <div className="flex gap-1.5">
                <span className="flex-1 text-center px-2 py-1 rounded text-[11px] font-bold text-white" style={{ backgroundColor: '#e03131' }}>
                  BLOCKER {blockerCount}
                </span>
                <span className="flex-1 text-center px-2 py-1 rounded text-[11px] font-bold text-white" style={{ backgroundColor: '#1971c2' }}>
                  BUILDER {builderCount}
                </span>
                <span className="flex-1 text-center px-2 py-1 rounded text-[11px] font-bold text-white" style={{ backgroundColor: '#f59f00' }}>
                  MIXED {mixedCount}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Layer Toggles */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Layers</label>
          <div className="space-y-0.5">
            {LAYER_CONFIG.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => onLayerToggle(key)}
                className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                  layers[key] ? 'bg-gray-700/80 text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`w-4 text-center text-xs ${layers[key] ? '' : 'opacity-30'}`}>{icon}</span>
                <span className="flex-1">{label}</span>
                <span className={`w-2 h-2 rounded-full ${layers[key] ? 'bg-green-500' : 'bg-gray-700'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Search All Layers</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="e.g. COSCO, Ramstein, Palantir..."
            className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {OWNER_PRESETS.map(({ label, query }) => {
              const active = filters.search.toLowerCase() === query;
              return (
                <button
                  key={query}
                  onClick={() => onFiltersChange({ ...filters, search: active ? '' : query })}
                  className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Port Alignment */}
        {layers.ports && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Port Alignment</label>
            <div className="space-y-0.5">
              {alignments.map(alignment => {
                const color = ALIGNMENT_COLORS[alignment] || '#868e96';
                const label = ALIGNMENT_LABELS[alignment] || alignment;
                const active = filters.alignments.has(alignment);
                return (
                  <button
                    key={alignment}
                    onClick={() => {
                      const next = new Set(filters.alignments);
                      if (active) next.delete(alignment); else next.add(alignment);
                      onFiltersChange({ ...filters, alignments: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.alignments.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1">{label}</span>
                    <span className="text-gray-400 text-[10px]">{ports.filter(p => p.alignment === alignment).length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Conflict Zone Filters */}
        {layers.conflicts && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Conflicts — By Type</label>
            <div className="space-y-0.5">
              {conflictTypes.map(type => {
                const color = CONFLICT_COLORS[type] || '#868e96';
                const active = filters.conflictTypes.has(type);
                const count = militaryConflicts.filter(c => c.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const next = new Set(filters.conflictTypes);
                      if (active) next.delete(type); else next.add(type);
                      onFiltersChange({ ...filters, conflictTypes: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.conflictTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace('_', ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Conflicts — By Status</label>
            <div className="space-y-0.5">
              {conflictStatuses.map(status => {
                const color = STATUS_COLORS[status] || '#868e96';
                const active = filters.conflictStatuses.has(status);
                const count = militaryConflicts.filter(c => c.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      const next = new Set(filters.conflictStatuses);
                      if (active) next.delete(status); else next.add(status);
                      onFiltersChange({ ...filters, conflictStatuses: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.conflictStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{status}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sanctions Filters */}
        {layers.sanctions && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Sanctions — By Status</label>
            <div className="space-y-0.5">
              {sanctionStatuses.map(status => {
                const color = STATUS_COLORS[status] || '#868e96';
                const active = filters.sanctionStatuses.has(status);
                const count = sanctionsRegimes.filter(s => s.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      const next = new Set(filters.sanctionStatuses);
                      if (active) next.delete(status); else next.add(status);
                      onFiltersChange({ ...filters, sanctionStatuses: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.sanctionStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{status}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Sanctions — By Type</label>
            <div className="space-y-0.5">
              {sanctionTypes.map(type => {
                const active = filters.sanctionTypes.has(type);
                const count = sanctionsRegimes.filter(s => s.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const next = new Set(filters.sanctionTypes);
                      if (active) next.delete(type); else next.add(type);
                      onFiltersChange({ ...filters, sanctionTypes: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.sanctionTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1 capitalize">{type}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Naval Filters */}
        {layers.naval && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Naval — By Operator</label>
            <div className="space-y-0.5">
              {navalOps.map(op => {
                const color = NAVAL_COLORS[op] || '#868e96';
                const active = filters.navalOperators.has(op);
                const count = navalDeployments.filter(d => d.operator === op).length;
                return (
                  <button
                    key={op}
                    onClick={() => {
                      const next = new Set(filters.navalOperators);
                      if (active) next.delete(op); else next.add(op);
                      onFiltersChange({ ...filters, navalOperators: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.navalOperators.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1">{op}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Naval — By Force Type</label>
            <div className="space-y-0.5">
              {navalForceTypes.map(ft => {
                const active = filters.navalForceTypes.has(ft);
                const count = navalDeployments.filter(d => d.force_type === ft).length;
                return (
                  <button
                    key={ft}
                    onClick={() => {
                      const next = new Set(filters.navalForceTypes);
                      if (active) next.delete(ft); else next.add(ft);
                      onFiltersChange({ ...filters, navalForceTypes: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.navalForceTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1">{FORCE_TYPE_LABELS[ft] || ft}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Regime Change Filters */}
        {layers.regimeChanges && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Regime Changes — By Type</label>
            <div className="space-y-0.5">
              {regimeTypes.map(type => {
                const color = REGIME_COLORS[type] || '#868e96';
                const active = filters.regimeTypes.has(type);
                const count = regimeChanges.filter(r => r.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const next = new Set(filters.regimeTypes);
                      if (active) next.delete(type); else next.add(type);
                      onFiltersChange({ ...filters, regimeTypes: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.regimeTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{type}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Regime Changes — New Alignment</label>
            <div className="space-y-0.5">
              {regimeNewAlignments.map(alignment => {
                const active = filters.regimeAlignments.has(alignment);
                const count = regimeChanges.filter(r => r.new_alignment === alignment).length;
                return (
                  <button
                    key={alignment}
                    onClick={() => {
                      const next = new Set(filters.regimeAlignments);
                      if (active) next.delete(alignment); else next.add(alignment);
                      onFiltersChange({ ...filters, regimeAlignments: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.regimeAlignments.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1">{ALIGNMENT_SHIFT_LABELS[alignment] || alignment}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Military Base Operators */}
        {layers.militaryBases && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Military — By Country</label>
            <div className="space-y-0.5">
              {operators.map(op => {
                const color = OPERATOR_COLORS[op] || '#868e96';
                const active = filters.militaryOperators.has(op);
                const count = militaryBases.filter(b => b.operator === op).length;
                return (
                  <button
                    key={op}
                    onClick={() => {
                      const next = new Set(filters.militaryOperators);
                      if (active) next.delete(op); else next.add(op);
                      onFiltersChange({ ...filters, militaryOperators: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.militaryOperators.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex-shrink-0 text-sm">{OPERATOR_FLAGS[op] || '📍'}</span>
                    <span className="text-gray-700 flex-1">{op}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Strategic Assets — By Owner */}
        {layers.strategicAssets && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Assets — By Country</label>
            <div className="space-y-0.5">
              {assetOwners.map(owner => {
                const color = OWNER_COLORS[owner] || '#868e96';
                const active = filters.assetOwners.has(owner);
                const count = strategicAssets.filter(a => a.owner === owner).length;
                return (
                  <button
                    key={owner}
                    onClick={() => {
                      const next = new Set(filters.assetOwners);
                      if (active) next.delete(owner); else next.add(owner);
                      onFiltersChange({ ...filters, assetOwners: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.assetOwners.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1">{owner}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Strategic Assets — By Category */}
        {layers.strategicAssets && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Assets — By Category</label>
            <div className="space-y-0.5">
              {assetCategories.map(cat => {
                const active = filters.assetCategories.has(cat);
                const count = strategicAssets.filter(a => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const next = new Set(filters.assetCategories);
                      if (active) next.delete(cat); else next.add(cat);
                      onFiltersChange({ ...filters, assetCategories: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.assetCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1 capitalize">{cat}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chokepoint Filters */}
        {layers.chokepoints && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Chokepoints — By Status</label>
            <div className="space-y-0.5">
              {chokeStatuses.map(status => {
                const color = STATUS_COLORS[status] || '#868e96';
                const active = filters.chokeStatuses.has(status);
                const count = chokepoints.filter(c => getChokeStatus(c.controller) === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      const next = new Set(filters.chokeStatuses);
                      if (active) next.delete(status); else next.add(status);
                      onFiltersChange({ ...filters, chokeStatuses: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.chokeStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{status}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Energy Pipeline Filters */}
        {layers.energyPipelines && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Pipelines — By Type</label>
            <div className="space-y-0.5">
              {pipelineTypes.map(type => {
                const color = type === 'oil' ? '#e03131' : '#22b8cf';
                const active = filters.pipelineTypes.has(type);
                const count = energyPipelines.filter(p => p.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const next = new Set(filters.pipelineTypes);
                      if (active) next.delete(type); else next.add(type);
                      onFiltersChange({ ...filters, pipelineTypes: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.pipelineTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{type}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Pipelines — By Status</label>
            <div className="space-y-0.5">
              {pipelineStatuses.map(status => {
                const color = STATUS_COLORS[status] || '#868e96';
                const active = filters.pipelineStatuses.has(status);
                const count = energyPipelines.filter(p => getPipelineStatusTag(p.status) === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      const next = new Set(filters.pipelineStatuses);
                      if (active) next.delete(status); else next.add(status);
                      onFiltersChange({ ...filters, pipelineStatuses: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.pipelineStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{status}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Energy Infrastructure Filters */}
        {layers.energyInfra && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Energy — By Category</label>
            <div className="space-y-0.5">
              {energyCategories.map(cat => {
                const active = filters.energyCategories.has(cat);
                const count = energyInfrastructure.filter(i => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const next = new Set(filters.energyCategories);
                      if (active) next.delete(cat); else next.add(cat);
                      onFiltersChange({ ...filters, energyCategories: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.energyCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1">{ENERGY_CATEGORY_LABELS[cat] || cat}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Energy — By Country</label>
            <div className="space-y-0.5 max-h-32 overflow-y-auto panel-scroll">
              {energyCountries.map(country => {
                const active = filters.energyCountries.has(country);
                const count = energyInfrastructure.filter(i => i.country === country).length;
                return (
                  <button
                    key={country}
                    onClick={() => {
                      const next = new Set(filters.energyCountries);
                      if (active) next.delete(country); else next.add(country);
                      onFiltersChange({ ...filters, energyCountries: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.energyCountries.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1">{country}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mining & Materials Filters */}
        {layers.mining && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Mining — By Material</label>
            <div className="space-y-0.5">
              {miningCategories.map(cat => {
                const color = MINING_CATEGORY_COLORS[cat] || '#868e96';
                const active = filters.miningCategories.has(cat);
                const count = miningMaterials.filter(m => m.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const next = new Set(filters.miningCategories);
                      if (active) next.delete(cat); else next.add(cat);
                      onFiltersChange({ ...filters, miningCategories: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.miningCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 flex-1 capitalize">{cat.replace('_', ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Mining — By Country</label>
            <div className="space-y-0.5 max-h-32 overflow-y-auto panel-scroll">
              {miningCountries.map(country => {
                const active = filters.miningCountries.has(country);
                const count = miningMaterials.filter(m => m.country === country).length;
                return (
                  <button
                    key={country}
                    onClick={() => {
                      const next = new Set(filters.miningCountries);
                      if (active) next.delete(country); else next.add(country);
                      onFiltersChange({ ...filters, miningCountries: next });
                    }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${
                      active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.miningCountries.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-gray-700 flex-1">{country}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Gold & Diamonds */}
        {layers.goldDiamonds && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Gold & Diamonds — Category</label>
            <div className="space-y-0.5">
              {goldCategories.map(cat => {
                const active = filters.goldCategories.has(cat);
                const count = goldDiamonds.filter(g => g.category === cat).length;
                return (
                  <button key={cat} onClick={() => { const next = new Set(filters.goldCategories); if (active) next.delete(cat); else next.add(cat); onFiltersChange({ ...filters, goldCategories: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.goldCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f59f00' }} />
                    <span className="text-gray-700 flex-1 capitalize">{cat.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Food & Grain */}
        {layers.foodGrain && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Food & Grain — Category</label>
            <div className="space-y-0.5">
              {foodCategories.map(cat => {
                const active = filters.foodCategories.has(cat);
                const count = foodGrain.filter(f => f.category === cat).length;
                return (
                  <button key={cat} onClick={() => { const next = new Set(filters.foodCategories); if (active) next.delete(cat); else next.add(cat); onFiltersChange({ ...filters, foodCategories: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.foodCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#74b816' }} />
                    <span className="text-gray-700 flex-1 capitalize">{cat.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submarine Cables */}
        {layers.submarineCables && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Cables — By Type</label>
            <div className="space-y-0.5">
              {cableTypes.map(type => {
                const active = filters.cableTypes.has(type);
                const count = submarineCables.filter(c => c.type === type).length;
                return (
                  <button key={type} onClick={() => { const next = new Set(filters.cableTypes); if (active) next.delete(type); else next.add(type); onFiltersChange({ ...filters, cableTypes: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.cableTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#0ea5e9' }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Water Infrastructure */}
        {layers.waterInfrastructure && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Water — By Type</label>
            <div className="space-y-0.5">
              {waterTypes.map(type => {
                const active = filters.waterTypes.has(type);
                const count = waterInfrastructure.filter(w => w.type === type).length;
                return (
                  <button key={type} onClick={() => { const next = new Set(filters.waterTypes); if (active) next.delete(type); else next.add(type); onFiltersChange({ ...filters, waterTypes: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.waterTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#1971c2' }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Financial Warfare */}
        {layers.financialWarfare && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Financial — By Type</label>
            <div className="space-y-0.5">
              {financeTypes.map(type => {
                const active = filters.financeTypes.has(type);
                const count = financialWarfare.filter(f => f.type === type).length;
                return (
                  <button key={type} onClick={() => { const next = new Set(filters.financeTypes); if (active) next.delete(type); else next.add(type); onFiltersChange({ ...filters, financeTypes: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.financeTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#7048e8' }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Arms Deals */}
        {layers.armsDeals && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Arms — By Seller Alignment</label>
            <div className="space-y-0.5">
              {armsSellerAlignments.map(alignment => {
                const active = filters.armsSellerAlignments.has(alignment);
                const count = armsDeals.filter(a => a.seller_alignment === alignment).length;
                return (
                  <button key={alignment} onClick={() => { const next = new Set(filters.armsSellerAlignments); if (active) next.delete(alignment); else next.add(alignment); onFiltersChange({ ...filters, armsSellerAlignments: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.armsSellerAlignments.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#e03131' }} />
                    <span className="text-gray-700 flex-1 capitalize">{alignment.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Space Assets */}
        {layers.spaceAssets && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Space — By Type</label>
            <div className="space-y-0.5">
              {spaceTypes.map(type => {
                const active = filters.spaceTypes.has(type);
                const count = spaceAssets.filter(s => s.type === type).length;
                return (
                  <button key={type} onClick={() => { const next = new Set(filters.spaceTypes); if (active) next.delete(type); else next.add(type); onFiltersChange({ ...filters, spaceTypes: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.spaceTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#1971c2' }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cyber Infrastructure */}
        {layers.cyberInfrastructure && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Cyber — By Type</label>
            <div className="space-y-0.5">
              {cyberTypes.map(type => {
                const active = filters.cyberTypes.has(type);
                const count = cyberInfrastructure.filter(c => c.type === type).length;
                return (
                  <button key={type} onClick={() => { const next = new Set(filters.cyberTypes); if (active) next.delete(type); else next.add(type); onFiltersChange({ ...filters, cyberTypes: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.cyberTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#7048e8' }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Shipping Lanes */}
        {layers.shippingLanes && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Shipping — By Disruption Status</label>
            <div className="space-y-0.5">
              {shippingStatuses.map(status => {
                const active = filters.shippingStatuses.has(status);
                const count = shippingLanes.filter(s => s.disruption_status === status).length;
                return (
                  <button key={status} onClick={() => { const next = new Set(filters.shippingStatuses); if (active) next.delete(status); else next.add(status); onFiltersChange({ ...filters, shippingStatuses: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.shippingStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[status] || '#868e96' }} />
                    <span className="text-gray-700 flex-1 capitalize">{status.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Treaties & Alliances */}
        {layers.treatiesAlliances && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Treaties — By Type</label>
            <div className="space-y-0.5">
              {allianceTypes.map(type => {
                const active = filters.allianceTypes.has(type);
                const count = treatiesAlliances.filter(t => t.type === type).length;
                return (
                  <button key={type} onClick={() => { const next = new Set(filters.allianceTypes); if (active) next.delete(type); else next.add(type); onFiltersChange({ ...filters, allianceTypes: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.allianceTypes.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ALLIANCE_TYPE_COLORS[type] || '#6b7280' }} />
                    <span className="text-gray-700 flex-1 capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {layers.offshoreZones && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Offshore — By Category</label>
            <div className="space-y-0.5">
              {offshoreCategories.map(cat => {
                const active = filters.offshoreCategories.has(cat);
                const count = offshoreZones.filter(z => z.category === cat).length;
                const catColor = { financial: '#f59f00', eez: '#1971c2', military_offshore: '#e03131' }[cat] || '#6b7280';
                return (
                  <button key={cat} onClick={() => { const next = new Set(filters.offshoreCategories); if (active) next.delete(cat); else next.add(cat); onFiltersChange({ ...filters, offshoreCategories: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.offshoreCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                    <span className="text-gray-700 flex-1 capitalize">{cat === 'eez' ? 'EEZ / Maritime' : cat === 'military_offshore' ? 'Military Offshore' : 'Financial'}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Offshore — By Status</label>
            <div className="space-y-0.5">
              {offshoreStatuses.map(status => {
                const active = filters.offshoreStatuses.has(status);
                const count = offshoreZones.filter(z => z.status === status).length;
                const statusColor = { active: '#2f9e44', contested: '#e03131', declining: '#f59f00', controlled: '#1971c2', expanding: '#0ea5e9' }[status] || '#6b7280';
                return (
                  <button key={status} onClick={() => { const next = new Set(filters.offshoreStatuses); if (active) next.delete(status); else next.add(status); onFiltersChange({ ...filters, offshoreStatuses: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.offshoreStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor }} />
                    <span className="text-gray-700 flex-1 capitalize">{status}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {layers.globalPlayers && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Global Players — By Category</label>
            <div className="space-y-0.5">
              {playerCategories.map(cat => {
                const active = filters.playerCategories.has(cat);
                const count = globalPlayers.filter(p => p.category === cat).length;
                const catColor = PLAYER_CATEGORY_COLORS[cat] || '#6b7280';
                const label = { asset_manager: 'Asset Managers', sovereign_wealth: 'Sovereign Wealth', state_corporation: 'State Corporations', private_conglomerate: 'Conglomerates', private_equity: 'Private Equity', tech_oligarch: 'Tech Oligarchs', trading_house: 'Trading Houses' }[cat] || cat;
                return (
                  <button key={cat} onClick={() => { const next = new Set(filters.playerCategories); if (active) next.delete(cat); else next.add(cat); onFiltersChange({ ...filters, playerCategories: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.playerCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                    <span className="text-gray-700 flex-1">{label}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Global Players — By Alignment</label>
            <div className="space-y-0.5">
              {playerAlignments.map(align => {
                const active = filters.playerAlignments.has(align);
                const count = globalPlayers.filter(p => p.alignment === align).length;
                const alignColor = { western: '#1971c2', china: '#e03131', russia: '#da3633', mixed: '#f59f00', india: '#e8590c' }[align] || '#6b7280';
                return (
                  <button key={align} onClick={() => { const next = new Set(filters.playerAlignments); if (active) next.delete(align); else next.add(align); onFiltersChange({ ...filters, playerAlignments: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.playerAlignments.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: alignColor }} />
                    <span className="text-gray-700 flex-1 capitalize">{align === 'mixed' ? 'Multi-aligned' : align}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* State Players filters */}
        {layers.statePlayers && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">State Players — By Tier</label>
            <div className="space-y-0.5">
              {stateTiers.map(tier => {
                const active = filters.stateTiers.has(tier);
                const count = statePlayers.filter(p => p.tier === tier).length;
                const tierColor = TIER_COLORS[tier] || '#6b7280';
                const label = { principal: 'Principal Powers', regional_power: 'Regional Powers', swing_state: 'Swing States', satellite: 'Satellites', contested: 'Contested Zones' }[tier] || tier;
                return (
                  <button key={tier} onClick={() => { const next = new Set(filters.stateTiers); if (active) next.delete(tier); else next.add(tier); onFiltersChange({ ...filters, stateTiers: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.stateTiers.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tierColor }} />
                    <span className="text-gray-700 flex-1">{label}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">State Players — By Bloc</label>
            <div className="space-y-0.5">
              {stateBlocs.map(bloc => {
                const active = filters.stateBlocs.has(bloc);
                const count = statePlayers.filter(p => p.bloc === bloc).length;
                const blocColor = BLOC_COLORS[bloc] || '#6b7280';
                return (
                  <button key={bloc} onClick={() => { const next = new Set(filters.stateBlocs); if (active) next.delete(bloc); else next.add(bloc); onFiltersChange({ ...filters, stateBlocs: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.stateBlocs.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: blocColor }} />
                    <span className="text-gray-700 flex-1">{bloc}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Transport Infrastructure */}
        {layers.transportInfra && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Transport — By Category</label>
            <div className="space-y-0.5">
              {transportCategories.map(cat => {
                const active = filters.transportCategories.has(cat);
                const count = transportInfrastructure.filter(t => t.category === cat).length;
                const catColor = { railway: '#e03131', highway: '#f59f00', bridge: '#7048e8', border_crossing: '#2f9e44', logistics_hub: '#0ea5e9' }[cat] || '#6b7280';
                const catLabel = { railway: 'Railways', highway: 'Highways', bridge: 'Bridges', border_crossing: 'Border Crossings', logistics_hub: 'Logistics Hubs' }[cat] || cat;
                return (
                  <button key={cat} onClick={() => { const next = new Set(filters.transportCategories); if (active) next.delete(cat); else next.add(cat); onFiltersChange({ ...filters, transportCategories: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.transportCategories.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                    <span className="text-gray-700 flex-1">{catLabel}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Transport — By Corridor</label>
            <div className="space-y-0.5">
              {transportCorridors.map(corridor => {
                const active = filters.transportCorridors.has(corridor);
                const count = transportInfrastructure.filter(t => t.corridor === corridor).length;
                const corridorColor = { BRI: '#e03131', CPEC: '#e03131', IMEC: '#1971c2', INSTC: '#e8590c', MIDDLE_CORRIDOR: '#f59f00', LOBITO: '#1971c2', IRAQ_DEV_ROAD: '#f59f00', RUSSIA: '#da3633', TURKEY_AZERBAIJAN: '#f59f00', PAN_ASIAN: '#7048e8', REGIONAL: '#6b7280' }[corridor] || '#6b7280';
                return (
                  <button key={corridor} onClick={() => { const next = new Set(filters.transportCorridors); if (active) next.delete(corridor); else next.add(corridor); onFiltersChange({ ...filters, transportCorridors: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.transportCorridors.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: corridorColor }} />
                    <span className="text-gray-700 flex-1">{corridor.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5 mt-3">Transport — By Status</label>
            <div className="space-y-0.5">
              {transportStatuses.map(status => {
                const active = filters.transportStatuses.has(status);
                const count = transportInfrastructure.filter(t => t.status === status).length;
                const statusColor = { operational: '#2f9e44', operational_expanding: '#0d9488', operational_limited: '#d97706', operational_degraded: '#e8590c', operational_restricted: '#e8590c', operational_seasonal: '#d97706', operational_fragmented: '#d97706', operational_underutilized: '#d97706', under_construction: '#1971c2', partially_complete: '#7048e8', planned: '#6b7280', stalled: '#e03131', damaged_operational: '#e03131', destroyed: '#991b1b' }[status] || '#6b7280';
                return (
                  <button key={status} onClick={() => { const next = new Set(filters.transportStatuses); if (active) next.delete(status); else next.add(status); onFiltersChange({ ...filters, transportStatuses: next }); }}
                    className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-[11px] cursor-pointer transition-colors ${active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.transportStatuses.size > 0 ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor }} />
                    <span className="text-gray-700 flex-1 capitalize">{status.replace(/_/g, ' ')}</span>
                    <span className="text-gray-400 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Corridor filter */}
        {layers.corridors && (
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Show Corridor Ports</label>
            <button
              onClick={() => onFiltersChange({ ...filters, corridorId: null })}
              className={`w-full text-left text-[11px] px-2 py-1 rounded mb-1 cursor-pointer ${
                !filters.corridorId ? 'bg-gray-700 ring-1 ring-gray-500 text-white' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              All ports
            </button>
            {Object.entries(corridorsByTeam).map(([team, items]) => {
              if (items.length === 0) return null;
              const meta = TEAM_META[team];
              return (
                <div key={team} className="mb-1.5">
                  <span className="text-[9px] font-semibold uppercase tracking-wide px-2" style={{ color: meta.color }}>{meta.label}</span>
                  {items.map(c => {
                    const active = filters.corridorId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onFiltersChange({ ...filters, corridorId: active ? null : c.id })}
                        className={`w-full text-left text-[11px] px-2 py-0.5 rounded cursor-pointer flex items-center gap-1.5 ${
                          active ? 'bg-blue-50 ring-1 ring-blue-300' : filters.corridorId ? 'opacity-40 hover:opacity-70' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                        <span className="text-gray-700 truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
