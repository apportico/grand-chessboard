import { useState, useCallback, useMemo } from 'react'
import Map from './Map'
import CorridorLegend from './CorridorLegend'
import MapSidebar, {
  applyPortFilters, applyMilitaryFilters, applyAssetFilters,
  applyConflictFilters, applySanctionFilters, applyNavalFilters, applyRegimeFilters,
  applyPipelineFilters, applyEnergyInfraFilters, applyMiningFilters, applyChokeFilters,
  applyGoldFilters, applyFoodFilters, applyCableFilters, applyWaterFilters,
  applyFinanceFilters, applyArmsFilters, applySpaceFilters, applyCyberFilters,
  applyShippingFilters, applyAllianceFilters, applyOffshoreFilters, applyGlobalPlayerFilters,
  applyStatePlayerFilters,
  applyTransportFilters,
} from './MapSidebar'

const INITIAL_FILTERS = {
  alignments: new Set(),
  corridorId: null,
  search: '',
  militaryOperators: new Set(),
  assetOwners: new Set(),
  assetCategories: new Set(),
  conflictTypes: new Set(),
  conflictStatuses: new Set(),
  sanctionStatuses: new Set(),
  sanctionTypes: new Set(),
  navalOperators: new Set(),
  navalForceTypes: new Set(),
  regimeTypes: new Set(),
  regimeAlignments: new Set(),
  pipelineTypes: new Set(),
  pipelineStatuses: new Set(),
  energyCategories: new Set(),
  energyCountries: new Set(),
  miningCategories: new Set(),
  miningCountries: new Set(),
  chokeStatuses: new Set(),
  goldCategories: new Set(),
  foodCategories: new Set(),
  cableTypes: new Set(),
  waterTypes: new Set(),
  financeTypes: new Set(),
  armsSellerAlignments: new Set(),
  spaceTypes: new Set(),
  cyberTypes: new Set(),
  shippingStatuses: new Set(),
  allianceTypes: new Set(),
  offshoreCategories: new Set(),
  offshoreStatuses: new Set(),
  playerCategories: new Set(),
  playerAlignments: new Set(),
  stateTiers: new Set(),
  stateBlocs: new Set(),
  transportCategories: new Set(),
  transportCorridors: new Set(),
  transportStatuses: new Set(),
};

const INITIAL_LAYERS = {
  corridors: true,
  ports: true,
  chokepoints: true,
  conflicts: false,
  sanctions: false,
  naval: false,
  regimeChanges: false,
  militaryBases: false,
  strategicAssets: false,
  energyPipelines: false,
  energyInfra: false,
  mining: false,
  goldDiamonds: false,
  foodGrain: false,
  submarineCables: false,
  waterInfrastructure: false,
  financialWarfare: false,
  armsDeals: false,
  spaceAssets: false,
  cyberInfrastructure: false,
  shippingLanes: false,
  treatiesAlliances: false,
  offshoreZones: false,
  globalPlayers: false,
  statePlayers: false,
  transportInfra: false,
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

  const filteredConflicts = useMemo(
    () => applyConflictFilters(state.militaryConflicts, filters),
    [state.militaryConflicts, filters]
  );

  const filteredSanctions = useMemo(
    () => applySanctionFilters(state.sanctionsRegimes, filters),
    [state.sanctionsRegimes, filters]
  );

  const filteredNaval = useMemo(
    () => applyNavalFilters(state.navalDeployments, filters),
    [state.navalDeployments, filters]
  );

  const filteredRegimeChanges = useMemo(
    () => applyRegimeFilters(state.regimeChanges, filters),
    [state.regimeChanges, filters]
  );

  const filteredPipelines = useMemo(
    () => applyPipelineFilters(state.energyPipelines, filters),
    [state.energyPipelines, filters]
  );

  const filteredEnergyInfra = useMemo(
    () => applyEnergyInfraFilters(state.energyInfrastructure, filters),
    [state.energyInfrastructure, filters]
  );

  const filteredMining = useMemo(
    () => applyMiningFilters(state.miningMaterials, filters),
    [state.miningMaterials, filters]
  );

  const filteredChokepoints = useMemo(
    () => applyChokeFilters(state.chokepoints, filters),
    [state.chokepoints, filters]
  );

  const filteredGold = useMemo(() => applyGoldFilters(state.goldDiamonds, filters), [state.goldDiamonds, filters]);
  const filteredFood = useMemo(() => applyFoodFilters(state.foodGrain, filters), [state.foodGrain, filters]);
  const filteredCables = useMemo(() => applyCableFilters(state.submarineCables, filters), [state.submarineCables, filters]);
  const filteredWater = useMemo(() => applyWaterFilters(state.waterInfrastructure, filters), [state.waterInfrastructure, filters]);
  const filteredFinance = useMemo(() => applyFinanceFilters(state.financialWarfare, filters), [state.financialWarfare, filters]);
  const filteredArms = useMemo(() => applyArmsFilters(state.armsDeals, filters), [state.armsDeals, filters]);
  const filteredSpace = useMemo(() => applySpaceFilters(state.spaceAssets, filters), [state.spaceAssets, filters]);
  const filteredCyber = useMemo(() => applyCyberFilters(state.cyberInfrastructure, filters), [state.cyberInfrastructure, filters]);
  const filteredShipping = useMemo(() => applyShippingFilters(state.shippingLanes, filters), [state.shippingLanes, filters]);
  const filteredAlliances = useMemo(() => applyAllianceFilters(state.treatiesAlliances, filters), [state.treatiesAlliances, filters]);
  const filteredOffshore = useMemo(() => applyOffshoreFilters(state.offshoreZones, filters), [state.offshoreZones, filters]);
  const filteredPlayers = useMemo(() => applyGlobalPlayerFilters(state.globalPlayers, filters), [state.globalPlayers, filters]);
  const filteredStatePlayers = useMemo(() => applyStatePlayerFilters(state.statePlayers, filters), [state.statePlayers, filters]);
  const filteredTransport = useMemo(() => applyTransportFilters(state.transportInfrastructure, filters), [state.transportInfrastructure, filters]);

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
          chokepoints={filteredChokepoints}
          corridors={state.corridors}
          visibleCorridors={effectiveVisibleCorridors}
          militaryBases={filteredBases}
          strategicAssets={filteredAssets}
          energyPipelines={filteredPipelines}
          miningMaterials={filteredMining}
          energyInfrastructure={filteredEnergyInfra}
          militaryConflicts={filteredConflicts}
          sanctionsRegimes={filteredSanctions}
          navalDeployments={filteredNaval}
          regimeChanges={filteredRegimeChanges}
          goldDiamonds={filteredGold}
          foodGrain={filteredFood}
          submarineCables={filteredCables}
          waterInfrastructure={filteredWater}
          financialWarfare={filteredFinance}
          armsDeals={filteredArms}
          spaceAssets={filteredSpace}
          cyberInfrastructure={filteredCyber}
          shippingLanes={filteredShipping}
          treatiesAlliances={filteredAlliances}
          offshoreZones={filteredOffshore}
          globalPlayers={filteredPlayers}
          statePlayers={filteredStatePlayers}
          transportInfrastructure={filteredTransport}
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
          militaryConflicts={state.militaryConflicts}
          sanctionsRegimes={state.sanctionsRegimes}
          navalDeployments={state.navalDeployments}
          regimeChanges={state.regimeChanges}
          energyPipelines={state.energyPipelines}
          energyInfrastructure={state.energyInfrastructure}
          miningMaterials={state.miningMaterials}
          chokepoints={state.chokepoints}
          goldDiamonds={state.goldDiamonds}
          foodGrain={state.foodGrain}
          submarineCables={state.submarineCables}
          waterInfrastructure={state.waterInfrastructure}
          financialWarfare={state.financialWarfare}
          armsDeals={state.armsDeals}
          spaceAssets={state.spaceAssets}
          cyberInfrastructure={state.cyberInfrastructure}
          shippingLanes={state.shippingLanes}
          treatiesAlliances={state.treatiesAlliances}
          offshoreZones={state.offshoreZones}
          globalPlayers={state.globalPlayers}
          statePlayers={state.statePlayers}
          transportInfrastructure={state.transportInfrastructure}
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
