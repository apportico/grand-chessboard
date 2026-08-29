import { useEffect, useCallback } from 'react'
import { useFilteredMoves } from '../hooks/useFilteredMoves'
import TheaterFilter from './TheaterFilter'
import DetailPanel from './DetailPanel'
import Timeline from './Timeline'
import MoveCard from './MoveCard'
import MoveForm from './MoveForm'
import ImportExport from './ImportExport'

export default function MovesPage({ state, dispatch }) {
  const filteredMoves = useFilteredMoves(state.moves, state.filters, state.selectedYear)

  const selectedMove = state.selectedMoveId
    ? state.moves.find(m => m.id === state.selectedMoveId) || null
    : null

  // Auto-advance timeline
  useEffect(() => {
    if (!state.isPlaying) return
    if (state.selectedYear >= 2026) {
      dispatch({ type: 'SET_PLAYING', value: false })
      return
    }
    const timer = setInterval(() => {
      dispatch({ type: 'SET_YEAR', year: state.selectedYear + 1 })
    }, 1500)
    return () => clearInterval(timer)
  }, [state.isPlaying, state.selectedYear, dispatch])

  const handleEditMove = useCallback(() => {
    if (selectedMove) dispatch({ type: 'SHOW_MOVE_FORM', move: selectedMove })
  }, [selectedMove, dispatch])

  const handleDeleteMove = useCallback(() => {
    if (selectedMove && window.confirm(`Delete move "${selectedMove.id}: ${selectedMove.title}"?`)) {
      dispatch({ type: 'DELETE_MOVE', id: selectedMove.id })
    }
  }, [selectedMove, dispatch])

  const handleSaveMove = useCallback((moveData) => {
    if (state.editingMove) {
      dispatch({ type: 'UPDATE_MOVE', move: moveData })
    } else {
      dispatch({ type: 'ADD_MOVE', move: moveData })
    }
    dispatch({ type: 'HIDE_MOVE_FORM' })
  }, [state.editingMove, dispatch])

  return (
    <>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Filters */}
        <TheaterFilter filters={state.filters} dispatch={dispatch} />

        {/* Center: Move feed */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Import/Export bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 border-b border-gray-200 flex-shrink-0">
            <span className="text-xs text-gray-400">
              {filteredMoves.length} move{filteredMoves.length !== 1 ? 's' : ''} shown
            </span>
            <ImportExport moves={state.moves} dispatch={dispatch} />
          </div>

          {/* Move cards grid */}
          <div className="flex-1 overflow-y-auto p-4 panel-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredMoves.map(move => (
                <MoveCard
                  key={move.id}
                  move={move}
                  isSelected={move.id === state.selectedMoveId}
                  onSelect={(id) => dispatch({ type: 'SELECT_MOVE', id })}
                />
              ))}
            </div>
            {filteredMoves.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">No moves match the current filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail panel */}
        <DetailPanel
          move={selectedMove}
          allMoves={state.moves}
          onEdit={handleEditMove}
          onDelete={handleDeleteMove}
          onClose={() => dispatch({ type: 'SELECT_MOVE', id: null })}
          onSelectMove={(id) => dispatch({ type: 'SELECT_MOVE', id })}
        />
      </div>

      {/* Bottom: Timeline */}
      <Timeline
        moves={filteredMoves}
        selectedYear={state.selectedYear}
        selectedMoveId={state.selectedMoveId}
        isPlaying={state.isPlaying}
        dispatch={dispatch}
      />

      {/* Move Form Modal */}
      {state.showMoveForm && (
        <MoveForm
          move={state.editingMove}
          onSave={handleSaveMove}
          onClose={() => dispatch({ type: 'HIDE_MOVE_FORM' })}
        />
      )}
    </>
  )
}
