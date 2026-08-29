import { useReducer } from 'react';
import masterData from '../data/corridor_wars_data.json';
import corridorMoves from '../data/corridor_moves.json';
import corridorGeo from '../data/corridors_geo.json';
import expandedPorts from '../data/ports_expanded.json';
import militaryBases from '../data/military_bases.json';
import strategicAssets from '../data/strategic_assets.json';
import energyPipelines from '../data/energy_pipelines.json';
import miningMaterials from '../data/mining_materials.json';
import energyInfrastructure from '../data/energy_infrastructure.json';
import militaryConflicts from '../data/military_conflicts.json';
import sanctionsRegimes from '../data/sanctions_regimes.json';
import navalDeployments from '../data/naval_deployments.json';
import regimeChanges from '../data/regime_changes.json';
import goldDiamonds from '../data/gold_diamonds.json';
import foodGrain from '../data/food_grain.json';
import submarineCables from '../data/submarine_cables.json';
import waterInfrastructure from '../data/water_infrastructure.json';
import financialWarfare from '../data/financial_warfare.json';
import armsDeals from '../data/arms_deals.json';
import spaceAssets from '../data/space_assets.json';
import cyberInfrastructure from '../data/cyber_infrastructure.json';
import shippingLanes from '../data/shipping_lanes.json';
import treatiesAlliances from '../data/treaties_alliances.json';
import offshoreZones from '../data/offshore_zones.json';
import globalPlayers from '../data/global_players.json';
import statePlayersRaw from '../data/state_players.json';
import transportInfrastructure from '../data/transport_infrastructure.json';

// Flatten state_players.json into a single array with tier field
const statePlayers = [
  ...(statePlayersRaw.principals || []).map(p => ({ ...p, tier: 'principal' })),
  ...(statePlayersRaw.regional_powers || []).map(p => ({ ...p, tier: 'regional_power' })),
  ...(statePlayersRaw.swing_states || []).map(p => ({ ...p, tier: 'swing_state' })),
  ...Object.values(statePlayersRaw.satellites || {}).flat().map(p => ({ ...p, tier: 'satellite' })),
  ...(statePlayersRaw.contested_zones || []).map(p => ({ ...p, tier: 'contested' })),
];

// Use corridor_moves.json as the source — it has all 72 moves including new additions
// Deduplicate: corridor_moves.json entries take priority over masterData
const masterMoves = masterData.moves || [];
const corridorMoveIds = new Set(corridorMoves.map(m => m.id));
const MONTH_MAP = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };
function parseSortKey(move) {
  const y = move.year || 2000;
  const dateStr = (move.date || '').toLowerCase();
  const monthMatch = dateStr.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/);
  const m = monthMatch ? MONTH_MAP[monthMatch[1]] : 1;
  const dayMatch = dateStr.match(/\b(\d{1,2})[,\s]/);
  const d = dayMatch ? parseInt(dayMatch[1], 10) : 1;
  return y * 10000 + m * 100 + d;
}
const originalMoves = [
  ...corridorMoves,
  ...masterMoves.filter(m => !corridorMoveIds.has(m.id)),
].sort((a, b) => parseSortKey(a) - parseSortKey(b));

// Merge original ports (rich detail) with expanded ports (lighter detail)
// Deduplicate by name — originals take priority
const originalPorts = masterData.ports || [];
const originalNames = new Set(originalPorts.map(p => p.name));
const allPorts = [
  ...originalPorts,
  ...expandedPorts.filter(p => !originalNames.has(p.name)),
];

const initialState = {
  moves: [...originalMoves],
  ports: allPorts,
  chokepoints: masterData.chokepoints || [],
  corridors: corridorGeo.corridors || [],
  militaryBases: militaryBases || [],
  strategicAssets: strategicAssets || [],
  energyPipelines: energyPipelines || [],
  miningMaterials: miningMaterials || [],
  energyInfrastructure: energyInfrastructure || [],
  militaryConflicts: militaryConflicts || [],
  sanctionsRegimes: sanctionsRegimes || [],
  navalDeployments: navalDeployments || [],
  regimeChanges: regimeChanges || [],
  goldDiamonds: goldDiamonds || [],
  foodGrain: foodGrain || [],
  submarineCables: submarineCables || [],
  waterInfrastructure: waterInfrastructure || [],
  financialWarfare: financialWarfare || [],
  armsDeals: armsDeals || [],
  spaceAssets: spaceAssets || [],
  cyberInfrastructure: cyberInfrastructure || [],
  shippingLanes: shippingLanes || [],
  treatiesAlliances: treatiesAlliances || [],
  offshoreZones: offshoreZones || [],
  globalPlayers: globalPlayers || [],
  statePlayers: statePlayers || [],
  transportInfrastructure: transportInfrastructure || [],
  stateAlliances: statePlayersRaw.alliances || [],
  selectedYear: 2026,
  selectedMoveId: null,
  filters: {
    theater: 'ALL',
    side: 'ALL',
  },
  isPlaying: false,
  showMoveForm: false,
  editingMove: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_YEAR':
      return { ...state, selectedYear: action.year };

    case 'SELECT_MOVE':
      return { ...state, selectedMoveId: action.id };

    case 'SET_THEATER_FILTER':
      return {
        ...state,
        filters: { ...state.filters, theater: action.theater },
      };

    case 'SET_SIDE_FILTER':
      return {
        ...state,
        filters: { ...state.filters, side: action.side },
      };

    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.value };

    case 'ADD_MOVE':
      return { ...state, moves: [...state.moves, action.move] };

    case 'UPDATE_MOVE':
      return {
        ...state,
        moves: state.moves.map((m) =>
          m.id === action.move.id ? { ...m, ...action.move } : m
        ),
      };

    case 'DELETE_MOVE':
      return {
        ...state,
        moves: state.moves.filter((m) => m.id !== action.id),
        selectedMoveId:
          state.selectedMoveId === action.id ? null : state.selectedMoveId,
      };

    case 'RESET_BOARD':
      return {
        ...state,
        moves: [...originalMoves],
        selectedYear: 2003,
        selectedMoveId: null,
        filters: { theater: 'ALL', side: 'ALL' },
        isPlaying: false,
        showMoveForm: false,
        editingMove: null,
      };

    case 'IMPORT_MOVES':
      return { ...state, moves: action.moves };

    case 'SHOW_MOVE_FORM':
      return {
        ...state,
        showMoveForm: true,
        editingMove: action.move || null,
      };

    case 'HIDE_MOVE_FORM':
      return { ...state, showMoveForm: false, editingMove: null };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return { state, dispatch };
}
