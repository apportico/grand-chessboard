import { useReducer } from 'react';
import masterData from '../data/corridor_wars_data.json';
import corridorGeo from '../data/corridors_geo.json';
import expandedPorts from '../data/ports_expanded.json';
import militaryBases from '../data/military_bases.json';
import strategicAssets from '../data/strategic_assets.json';
import energyPipelines from '../data/energy_pipelines.json';
import miningMaterials from '../data/mining_materials.json';
import energyInfrastructure from '../data/energy_infrastructure.json';

const originalMoves = masterData.moves || [];

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
