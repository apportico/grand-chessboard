export default function Scoreboard({ moves, selectedYear, page, onPageChange, onAddMove, onReset }) {
  return (
    <div className="bg-white text-gray-900 h-12 flex items-center px-4 gap-4 w-full select-none flex-shrink-0 border-b border-gray-200">
      <h1 className="text-base font-bold tracking-wide flex-shrink-0">THE GRAND CHESSBOARD</h1>

      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onPageChange('map')}
          className={`text-xs px-3 py-1 rounded cursor-pointer transition-colors ${
            page === 'map'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => onPageChange('labor')}
          className={`text-xs px-3 py-1 rounded cursor-pointer transition-colors ${
            page === 'labor'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Labor
        </button>
        <button
          onClick={() => onPageChange('moves')}
          className={`text-xs px-3 py-1 rounded cursor-pointer transition-colors ${
            page === 'moves'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Moves
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 flex-shrink-0">
        {page === 'moves' && (
          <>
            <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded">
              {selectedYear}
            </span>
            <button
              onClick={onAddMove}
              className="text-xs font-semibold bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition-colors cursor-pointer"
            >
              + Add Move
            </button>
            <button
              onClick={onReset}
              className="text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-colors cursor-pointer"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
