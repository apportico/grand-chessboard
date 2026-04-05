const SIDE_COLORS = {
  BLOCKER: '#e03131',
  BUILDER: '#1971c2',
  MIXED: '#f59f00',
  UNKNOWN: '#868e96',
};

export default function MoveCard({ move, isSelected, onSelect }) {
  const sideBg = SIDE_COLORS[move.side] || SIDE_COLORS.UNKNOWN;

  return (
    <button
      onClick={() => onSelect(move.id)}
      className={`w-full text-left bg-white rounded-lg border border-gray-200 p-3 cursor-pointer transition-all hover:bg-gray-50 hover:ring-1 hover:ring-gray-300 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
          {move.id}
        </span>
        <span
          className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded"
          style={{ backgroundColor: sideBg }}
        >
          {move.side || 'UNKNOWN'}
        </span>
        {move.theater && (
          <span className="text-[10px] text-gray-500 ml-auto">{move.theater.replace(/_/g, ' ')}</span>
        )}
      </div>

      <p className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-2">
        {move.title}
      </p>

      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[11px] text-gray-400">{move.date}</p>
        <p className="text-[11px] text-gray-500 truncate ml-2 max-w-[50%] text-right">{move.actor}</p>
      </div>
    </button>
  );
}
