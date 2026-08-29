import { useState, useCallback } from 'react'
import { useGameState } from './hooks/useGameState'
import Scoreboard from './components/Scoreboard'
import MapPage from './components/MapPage'
import MovesPage from './components/MovesPage'
import LaborPage from './components/LaborPage'

function App() {
  const { state, dispatch } = useGameState()
  const [page, setPage] = useState('map')

  const handleAddMove = useCallback(() => {
    dispatch({ type: 'SHOW_MOVE_FORM', move: null })
  }, [dispatch])

  const handleReset = useCallback(() => {
    if (window.confirm('Reset board to initial state? All custom moves will be lost.')) {
      dispatch({ type: 'RESET_BOARD' })
    }
  }, [dispatch])

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-gray-900 overflow-hidden">
      <Scoreboard
        moves={state.moves}
        selectedYear={state.selectedYear}
        page={page}
        onPageChange={setPage}
        onAddMove={handleAddMove}
        onReset={handleReset}
      />

      {page === 'map' && <MapPage state={state} />}
      {page === 'moves' && <MovesPage state={state} dispatch={dispatch} />}
      {page === 'labor' && <LaborPage />}
    </div>
  )
}

export default App
