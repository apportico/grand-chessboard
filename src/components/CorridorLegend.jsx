import { useState } from 'react';

const TEAM_META = {
  BLOCKER: { label: 'Blocker', color: '#f85149' },
  BUILDER: { label: 'Builder', color: '#58a6ff' },
  MIXED: { label: 'Mixed', color: '#d29922' },
};

const STATUS_META = {
  operational: { label: 'Operational', symbol: '━━━━' },
  partial: { label: 'Under construction', symbol: '╍ ╍ ╍' },
  stalled: { label: 'Stalled / Planned', symbol: '· · · ·' },
};

export default function CorridorLegend({ corridors, visibleCorridors, onToggle, onShowAll, onHideAll }) {
  const [collapsed, setCollapsed] = useState(false);
  const allVisible = corridors.length > 0 && corridors.every(c => visibleCorridors.has(c.id));
  const noneVisible = corridors.length > 0 && corridors.every(c => !visibleCorridors.has(c.id));

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="bg-white/90 backdrop-blur text-gray-700 text-xs px-2.5 py-1.5 rounded border border-gray-200 cursor-pointer hover:bg-gray-800/90"
      >
        Legend
      </button>
    );
  }

  // Group corridors by team
  const grouped = { BLOCKER: [], BUILDER: [], MIXED: [] };
  corridors.forEach(c => {
    const team = c.team || 'MIXED';
    if (grouped[team]) grouped[team].push(c);
    else grouped.MIXED.push(c);
  });

  return (
    <div className="bg-white/90 backdrop-blur rounded-lg border border-gray-200 p-3 max-h-[70vh] overflow-y-auto panel-scroll w-56">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Legend</span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer leading-none"
        >
          &minus;
        </button>
      </div>

      {/* Line style key */}
      <div className="mb-3 pb-2.5 border-b border-gray-200">
        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Line Style</span>
        {Object.entries(STATUS_META).map(([key, { label, symbol }]) => (
          <div key={key} className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-mono text-gray-500 w-12 text-center">{symbol}</span>
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Color key */}
      <div className="mb-3 pb-2.5 border-b border-gray-200">
        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Color = Side</span>
        {Object.entries(TEAM_META).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-2 mt-1">
            <span className="w-5 h-0.5 rounded flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Show/Hide All */}
      <div className="flex gap-1.5 mb-3 pb-2.5 border-b border-gray-200">
        <button
          onClick={onShowAll}
          disabled={allVisible}
          className={`flex-1 text-[10px] py-1 rounded cursor-pointer transition-colors ${
            allVisible ? 'bg-gray-100 text-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Show All
        </button>
        <button
          onClick={onHideAll}
          disabled={noneVisible}
          className={`flex-1 text-[10px] py-1 rounded cursor-pointer transition-colors ${
            noneVisible ? 'bg-gray-100 text-gray-300' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Hide All
        </button>
      </div>

      {/* Corridors grouped by team */}
      {Object.entries(grouped).map(([team, items]) => {
        if (items.length === 0) return null;
        const meta = TEAM_META[team];
        return (
          <div key={team} className="mb-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: meta.color }}>
                {meta.label}
              </span>
            </div>
            {items.map(c => {
              const visible = visibleCorridors.has(c.id);
              const opStatus = c.opStatus || 'operational';
              return (
                <button
                  key={c.id}
                  onClick={() => onToggle(c.id)}
                  className={`flex items-center gap-2 w-full text-left py-0.5 px-1 rounded text-[11px] cursor-pointer transition-opacity ${
                    visible ? 'opacity-100' : 'opacity-25'
                  } hover:bg-gray-100/50`}
                >
                  {/* Line preview */}
                  <svg width="18" height="6" className="flex-shrink-0">
                    <line
                      x1="0" y1="3" x2="18" y2="3"
                      stroke={meta.color}
                      strokeWidth="2"
                      strokeDasharray={
                        opStatus === 'stalled' ? '2,3' :
                        opStatus === 'partial' ? '5,3' :
                        'none'
                      }
                    />
                  </svg>
                  <span className="text-gray-600 truncate leading-tight">{c.name}</span>
                </button>
              );
            })}
          </div>
        );
      })}

      {/* Port alignment key */}
      <div className="mt-1 pt-2.5 border-t border-gray-200">
        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Port Dots</span>
        {[
          { color: '#e03131', label: 'China-controlled' },
          { color: '#1971c2', label: 'Western-operated' },
          { color: '#e8590c', label: 'India-operated' },
          { color: '#f59f00', label: 'UAE-operated' },
          { color: '#2f9e44', label: 'State-owned' },
          { color: '#7048e8', label: 'Mixed / Contested' },
          { color: '#9c36b5', label: 'Strategic' },
          { color: '#da3633', label: 'Russia' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Chokepoint key */}
      <div className="mt-2 pt-2.5 border-t border-gray-200">
        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Chokepoints</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-red-400" style={{ backgroundColor: 'rgba(255, 107, 107, 0.25)' }} />
          <span className="text-[11px] text-gray-500">Contested / Strategic strait</span>
        </div>
      </div>
    </div>
  );
}
