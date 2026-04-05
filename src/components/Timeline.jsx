import React from 'react';

const SIDE_COLORS = {
  BLOCKER: '#e03131',
  BUILDER: '#1971c2',
  MIXED: '#f59f00',
  UNKNOWN: '#868e96',
};

export default function Timeline({ moves, selectedYear, selectedMoveId, isPlaying, dispatch }) {
  const visibleMoves = moves.filter((m) => m.year <= selectedYear);

  const grouped = {};
  for (const m of visibleMoves) {
    if (!grouped[m.year]) grouped[m.year] = [];
    grouped[m.year].push(m);
  }

  const years = Array.from({ length: 2026 - 2003 + 1 }, (_, i) => 2003 + i);

  return (
    <div className="bg-gray-50 text-gray-900 border-t border-gray-200 px-4 py-3 w-full select-none flex-shrink-0">
      {/* Slider row */}
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <span className="text-xs text-gray-500 flex-shrink-0 w-10 text-right">2003</span>

        <input
          type="range"
          min={2003}
          max={2026}
          value={selectedYear}
          onChange={(e) => dispatch({ type: 'SET_YEAR', year: Number(e.target.value) })}
          className="flex-1 h-2 accent-blue-500 cursor-pointer"
        />

        <span className="text-xs text-gray-500 flex-shrink-0 w-10">2026</span>

        <span className="text-sm font-bold bg-gray-700 px-3 py-1 rounded flex-shrink-0">
          {selectedYear}
        </span>
      </div>

      {/* Chips row */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-3 min-w-max">
          {years.map((year) => {
            const yearMoves = grouped[year];
            if (!yearMoves || yearMoves.length === 0) return null;

            return (
              <div key={year} className="flex flex-col items-start gap-1">
                <span className="text-[10px] text-gray-400 font-mono">{year}</span>
                <div className="flex gap-1 flex-wrap">
                  {yearMoves.map((m) => {
                    const isSelected = m.id === selectedMoveId;
                    const bg = SIDE_COLORS[m.side] || SIDE_COLORS.UNKNOWN;

                    return (
                      <button
                        key={m.id}
                        onClick={() => dispatch({ type: 'SELECT_MOVE', id: m.id })}
                        title={`${m.id} — ${m.title}`}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold text-white cursor-pointer transition-shadow ${
                          isSelected ? 'ring-2 ring-gray-800 ring-offset-1 ring-offset-gray-50' : ''
                        }`}
                        style={{ backgroundColor: bg }}
                      >
                        {m.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
