import { useState } from 'react'

const SIDE_COLORS = {
  BLOCKER: '#e03131',
  BUILDER: '#1971c2',
  MIXED: '#f59f00',
  UNKNOWN: '#868e96',
}

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
  INDO_PACIFIC: '#06b6d4',
}

export default function DetailPanel({ move, allMoves = [], onEdit, onDelete, onClose, onSelectMove }) {
  if (!move) {
    return (
      <div className="panel-scroll w-80 bg-gray-50 overflow-y-auto p-4 border-l border-gray-200 flex items-center justify-center">
        <p className="text-gray-400 text-sm text-center">Select a move to view details</p>
      </div>
    )
  }

  const sideColor = SIDE_COLORS[move.side] || SIDE_COLORS.UNKNOWN
  const theaterColor = THEATER_COLORS[move.theater] || '#868e96'

  return (
    <div className="panel-scroll w-80 bg-gray-50 overflow-y-auto p-4 border-l border-gray-200 relative text-gray-900">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg leading-none cursor-pointer"
      >
        &times;
      </button>

      {/* ID badge */}
      <span
        className="inline-block font-mono text-xs px-2 py-0.5 rounded mb-2"
        style={{ backgroundColor: sideColor, color: '#fff' }}
      >
        {move.id}
      </span>

      {/* Side badge */}
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full ml-2 mb-2"
        style={{ backgroundColor: sideColor, color: '#fff' }}
      >
        {move.side || 'UNKNOWN'}
      </span>

      {/* Theater badge */}
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full ml-2 mb-2"
        style={{ backgroundColor: theaterColor, color: '#fff' }}
      >
        {move.theater || 'N/A'}
      </span>

      {/* Date */}
      <p className="text-gray-400 text-xs mt-2">{move.date}</p>

      {/* Actor */}
      <p className="font-bold text-sm mt-1">{move.actor}</p>

      {/* Title */}
      <h2 className="text-lg font-bold mt-2 leading-tight">{move.title}</h2>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-3 whitespace-pre-wrap leading-relaxed">
        {move.desc}
      </p>

      {/* Impact box */}
      {move.impact && (
        <div
          className="mt-4 p-3 rounded text-sm font-medium"
          style={{
            backgroundColor: sideColor + '22',
            borderLeft: `3px solid ${sideColor}`,
            color: '#fff',
          }}
        >
          {move.impact}
        </div>
      )}

      {/* Causal Links */}
      {move.triggered_by?.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Triggered by</p>
          <div className="flex flex-wrap gap-1">
            {move.triggered_by.map(id => {
              const linked = allMoves.find(m => m.id === id);
              const linkedColor = linked ? (SIDE_COLORS[linked.side] || '#868e96') : '#868e96';
              return (
                <button
                  key={id}
                  onClick={() => onSelectMove && onSelectMove(id)}
                  className="text-xs font-mono px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: linkedColor, color: '#fff' }}
                  title={linked?.title || id}
                >
                  {id}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {move.triggers?.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Leads to</p>
          <div className="flex flex-wrap gap-1">
            {move.triggers.map(id => {
              const linked = allMoves.find(m => m.id === id);
              const linkedColor = linked ? (SIDE_COLORS[linked.side] || '#868e96') : '#868e96';
              return (
                <button
                  key={id}
                  onClick={() => onSelectMove && onSelectMove(id)}
                  className="text-xs font-mono px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: linkedColor, color: '#fff' }}
                  title={linked?.title || id}
                >
                  {id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => onEdit(move)}
          className="flex-1 text-xs px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(move)}
          className="flex-1 text-xs px-3 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
