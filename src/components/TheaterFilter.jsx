const THEATER_COLORS = {
  ROOT: '#991b1b',
  DEEP: '#e03131',
  PRE: '#e8590c',
  PROLOGUE: '#2f9e44',
  MIDDLE_EAST: '#1971c2',
  WESTERN_HEM: '#7048e8',
  SOUTH_ASIA: '#0d9488',
  CAUCASUS: '#d97706',
  HORN_AFRICA: '#ec4899',
}

const THEATERS = [
  'ROOT',
  'DEEP',
  'PRE',
  'PROLOGUE',
  'MIDDLE_EAST',
  'WESTERN_HEM',
  'SOUTH_ASIA',
  'CAUCASUS',
  'HORN_AFRICA',
]

const SIDE_OPTIONS = [
  { name: 'BLOCKER', color: '#e03131' },
  { name: 'BUILDER', color: '#1971c2' },
  { name: 'MIXED', color: '#f59f00' },
]

export default function TheaterFilter({ filters, dispatch }) {
  const activeTheater = filters.theater || 'ALL'
  const activeSide = filters.side || 'ALL'

  return (
    <div className="panel-scroll w-52 bg-gray-50 p-3 overflow-y-auto text-gray-900 border-r border-gray-200">
      {/* Theater filter */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Theater
      </h3>

      <button
        onClick={() => dispatch({ type: 'SET_THEATER_FILTER', theater: 'ALL' })}
        className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 cursor-pointer flex items-center gap-2 ${
          activeTheater === 'ALL'
            ? 'ring-1 ring-blue-400 bg-blue-50'
            : 'hover:bg-gray-100'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block shrink-0" />
        All
      </button>

      {THEATERS.map((theater) => (
        <button
          key={theater}
          onClick={() => dispatch({ type: 'SET_THEATER_FILTER', theater })}
          className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 cursor-pointer flex items-center gap-2 ${
            activeTheater === theater
              ? 'ring-1 ring-blue-400 bg-blue-50'
              : 'hover:bg-gray-100'
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ backgroundColor: THEATER_COLORS[theater] }}
          />
          {theater.replace(/_/g, ' ')}
        </button>
      ))}

      {/* Side filter */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">
        Side
      </h3>

      <button
        onClick={() => dispatch({ type: 'SET_SIDE_FILTER', side: 'ALL' })}
        className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 cursor-pointer flex items-center gap-2 ${
          activeSide === 'ALL'
            ? 'ring-1 ring-blue-400 bg-blue-50'
            : 'hover:bg-gray-100'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block shrink-0" />
        All
      </button>

      {SIDE_OPTIONS.map(({ name, color }) => (
        <button
          key={name}
          onClick={() => dispatch({ type: 'SET_SIDE_FILTER', side: name })}
          className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 cursor-pointer flex items-center gap-2 ${
            activeSide === name
              ? 'ring-1 ring-blue-400 bg-blue-50'
              : 'hover:bg-gray-100'
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ backgroundColor: color }}
          />
          {name}
        </button>
      ))}
    </div>
  )
}
