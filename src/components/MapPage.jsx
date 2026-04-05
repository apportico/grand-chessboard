import { useState, useCallback, useMemo } from 'react'
import Map from './Map'
import CorridorLegend from './CorridorLegend'
import MapSidebar, { applyPortFilters, applyMilitaryFilters, applyAssetFilters } from './MapSidebar'

const INITIAL_FILTERS = {
  alignments: new Set(),
  corridorId: null,
  search: '',
  militaryOperators: new Set(),
  assetOwners: new Set(),
  assetCategories: new Set(),
};

const INITIAL_LAYERS = {
  corridors: true,
  ports: true,
  chokepoints: true,
  militaryBases: false,
  strategicAssets: false,
  energyPipelines: false,
  energyInfra: false,
  mining: false,
};

export default function MapPage({ state }) {
  const [visibleCorridors, setVisibleCorridors] = useState(() => {
    return new Set(state.corridors.map(c => c.id))
  })
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [layers, setLayers] = useState(INITIAL_LAYERS);

  const handleToggleCorridor = useCallback((id) => {
    setVisibleCorridors(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleShowAllCorridors = useCallback(() => {
    setVisibleCorridors(new Set(state.corridors.map(c => c.id)))
  }, [state.corridors])

  const handleHideAllCorridors = useCallback(() => {
    setVisibleCorridors(new Set())
  }, [])

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    if (newFilters.corridorId) {
      setVisibleCorridors(prev => {
        if (prev.has(newFilters.corridorId)) return prev;
        const next = new Set(prev);
        next.add(newFilters.corridorId);
        return next;
      });
    }
  }, []);

  const handleLayerToggle = useCallback((layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // Apply filters
  const filteredPorts = useMemo(
    () => applyPortFilters(state.ports, filters),
    [state.ports, filters]
  );

  const filteredBases = useMemo(
    () => applyMilitaryFilters(state.militaryBases, filters),
    [state.militaryBases, filters]
  );

  const filteredAssets = useMemo(
    () => applyAssetFilters(state.strategicAssets, filters),
    [state.strategicAssets, filters]
  );

  const effectiveVisibleCorridors = useMemo(() => {
    if (filters.corridorId) {
      return new Set([filters.corridorId]);
    }
    return visibleCorridors;
  }, [filters.corridorId, visibleCorridors]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative">
        <Map
          ports={filteredPorts}
          chokepoints={state.chokepoints}
          corridors={state.corridors}
          visibleCorridors={effectiveVisibleCorridors}
          militaryBases={filteredBases}
          strategicAssets={filteredAssets}
          energyPipelines={state.energyPipelines}
          miningMaterials={state.miningMaterials}
          energyInfrastructure={state.energyInfrastructure}
          layers={layers}
        />
        <div className="absolute bottom-3 left-3 z-[1000]">
          <CorridorLegend
            corridors={state.corridors}
            visibleCorridors={effectiveVisibleCorridors}
            onToggle={handleToggleCorridor}
            onShowAll={handleShowAllCorridors}
            onHideAll={handleHideAllCorridors}
          />
        </div>
      </div>

      <div className="flex-shrink-0 z-[1000]">
        <MapSidebar
          ports={state.ports}
          corridors={state.corridors}
          militaryBases={state.militaryBases}
          strategicAssets={state.strategicAssets}
          moves={state.moves}
          selectedYear={state.selectedYear}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          layers={layers}
          onLayerToggle={handleLayerToggle}
        />
      </div>
    </div>
  )
}
