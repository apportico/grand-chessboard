import { useMemo } from 'react'

export function useFilteredMoves(moves, filters, selectedYear) {
  return useMemo(() => {
    return moves.filter(move => {
      if (move.year > selectedYear) return false
      if (filters.theater !== 'ALL' && move.theater !== filters.theater) return false
      if (filters.side !== 'ALL' && move.side !== filters.side) return false
      return true
    })
  }, [moves, filters, selectedYear])
}
