import { useState, useMemo } from 'react';
import { ALIGNMENT_COLORS } from '../utils/colors';
import { OPERATOR_COLORS } from './MilitaryBaseMarker';
import { OWNER_COLORS } from './AssetMarker';

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
  { key: 'militaryBases', label: 'Military Bases', icon: '◆' },
  { key: 'strategicAssets', label: 'Strategic Assets', icon: '■' },
  { key: 'energyPipelines', label: 'Energy Pipelines', icon: '~' },
  { key: 'energyInfra', label: 'Energy Infrastructure', icon: '⛽' },
  { key: 'mining', label: 'Mining & Materials', icon: '⬡' },
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

export default function MapSidebar({
  ports, corridors, militaryBases, strategicAssets,
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

  const hasActiveFilters = filters.alignments.size > 0 || filters.corridorId || filters.search ||
    filters.militaryOperators.size > 0 || filters.assetOwners.size > 0 || filters.assetCategories.size > 0;

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
                    <svg width="10" height="10" viewBox="0 0 14 14" className="flex-shrink-0">
                      <rect x="2" y="2" width="10" height="10" rx="1" transform="rotate(45 7 7)" fill={color} />
                    </svg>
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
