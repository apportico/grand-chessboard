# CORRIDOR WARS — Data Inventory

> Last updated: 2026-04-05
> All data lives in `src/data/`. This file tracks every data layer, its contents, and remaining gaps.

---

## DATA LAYERS (24 files, ~750+ entries)

### CORE GAME DATA

#### 1. Geopolitical Moves — `corridor_moves.json` + master
- **50 moves** across 9 theaters (2003–2026)
- Fields: id, team, date, actor, title, desc, impact, side, theater, year, triggered_by, triggers

#### 2. Ports
- **`port_data.json`** — 19 strategic ports (lat/lon, country, alignment, owner, operator, alerts)
- **`ports_expanded.json`** — 88 ports (broader coverage with lat/lon)

#### 3. Chokepoints — master (`corridor_wars_data.json`)
- **11 chokepoints**: Hormuz, Bab al-Mandab, Suez, Malacca, Panama, GIUK, Gibraltar, Bosporus, Lombok/Sunda, Cape of Good Hope, Danish Straits
- Has: lat/lon, controller, traffic stats

#### 4. Trade Corridors — `corridors_geo.json` + master
- **`corridors_geo.json`** — 20 corridors with full waypoint polylines
  - Maritime (4): BRI Maritime, Polar Silk Road, Suez Route, Cape Route
  - Land (13): BRI Land, Eurasian Land Bridge, CPEC, China-Indochina, Iraq Dev Road, Middle Corridor, Zangezur, Djibouti-Addis, Mombasa-Nairobi, Lobito, BCIM, China-Myanmar Pipe, Trans-Siberian, Lapis Lazuli
  - Mixed (3): IMEC, INSTC, Middle Corridor
- **Master** — 4 corridors (IMEC, BRI, INSTC, Iraq Dev Road) with text routes + color

#### 5. Master File — `corridor_wars_data.json`
- Combined: meta, 50 moves, 19 ports, 11 chokepoints, 4 corridors

---

### MILITARY & SECURITY

#### 6. Military Bases — `military_bases.json`
- **50 bases**: Naval 16 | Air 10 | Joint 10 | Army 8 | Intelligence 4 | Logistics 2
- Has: lat/lon, operator, status, tags

#### 7. Military Conflicts �� `military_conflicts.json`
- **20 conflicts**: Interstate 6 | Civil war 6 | Proxy 4 | Insurgency 4
- Has: lat/lon, parties, dates, affected corridors/chokepoints, casualties, displacement

#### 8. Naval Deployments — `naval_deployments.json`
- **15 deployments**: Fleets 7 | Task forces 3 | Carrier groups 2 | Patrols 2 | Naval base 1
- Has: lat/lon, operator, vessels, mission, controls_chokepoints

#### 9. Arms Deals & Weapons Transfers — `arms_deals.json`
- **22 entries**: US exports 6 | Russia exports 5 | China exports 5 | Iran transfers 4 | Other 3
- Has: seller, buyer, value, weapons, strategic_value, alignment
- Covers: US→Saudi/Israel/India/Taiwan, Russia→India/China/Iran, China→Pakistan/Saudi/Serbia, Iran→Houthis/Hezbollah/Russia, France→India, Turkey→Ukraine, DPRK→Russia

---

### ENERGY & RESOURCES

#### 10. Energy Infrastructure — `energy_infrastructure.json`
- **49 assets**: Refineries 15 | LNG terminals 12 | Oil/gas fields 12 | Nuclear 10
- Has: lat/lon, owner, capacity, description

#### 11. Energy Pipelines — `energy_pipelines.json`
- **27 pipelines**: Gas 15 | Oil 12
- Has: waypoints, operator, capacity, status, color

#### 12. Mining & Critical Materials — `mining_materials.json`
- **68 entries**: Uranium 10 | Rare earth 8 | Lithium 8 | Copper 8 | Steel 8 | Semiconductors 8 | Cobalt 6 | Aluminum 4 | Nickel 4 | Iron ore 4
- Has: lat/lon, owner, production stats, tags

#### 13. Gold & Diamonds — `gold_diamonds.json`
- **29 entries**: Gold mines 13 | Gold reserves 4 | Gold routes 1 | Diamond mines 7 | Diamond processing 2 | Lab-grown diamonds 2
- Covers: Wagner-controlled African mines (Mali, Sudan, Burkina Faso), Muruntau, Grasberg, Nevada, Witwatersrand, Olimpiada, central bank reserves (Russia/China/India/Turkey), Dubai laundering hub, Alrosa, De Beers, Surat processing, China lab-grown
- Has: lat/lon, owner, production, alignment, strategic_value, alerts

#### 14. Food & Grain Corridors — `food_grain.json`
- **24 entries**: Grain terminals 8 | Fertilizer 8 | Food chokepoints 5 | Strategic reserves 1 | Water-food nexus 2
- Covers: Black Sea terminals (Odesa, Novorossiysk), US Gulf, Argentina, Brazil, Belaruskali/Nutrien/Uralkali potash, OCP phosphate (Morocco), China SINOGRAIN reserves, GERD Dam, Turkey GAP dams
- Has: lat/lon, owner, production, alignment, strategic_value

#### 15. Water Infrastructure — `water_infrastructure.json`
- **14 entries**: Dams 6 | River systems 3 | Water treaties 2 | Water crises 3
- Covers: GERD (Ethiopia vs Egypt), Ataturk/Ilisu (Turkey choking Iraq), Tabqa (Syria), Indus Waters Treaty, Rogun (Tajikistan), Aral Sea, Mekong cascade (China's 11 dams), Jordan River, Great Man-Made River (Libya), China South-North Transfer
- Has: lat/lon, controller, capacity, downstream_impact, alignment

---

### ECONOMIC & FINANCIAL

#### 16. Strategic Assets — `strategic_assets.json`
- **89 assets**: Defense 22 | Energy 18 | Technology 16 | Infrastructure 12 | Corporate 9 | Finance 6 | Intelligence 6
- Has: lat/lon, owner, category/subcategory, description, tags

#### 17. Financial Warfare — `financial_warfare.json`
- **18 entries**: Payment systems 5 | Currency deals 5 | Sovereign funds 5 | Sanctions tools 3
- Covers: SWIFT weaponization, SPFS (Russia), CIPS (China), BRICS payment proposals, mBridge CBDC, Saudi yuan oil, dedollarization moves, OFAC/EU sanctions, Turkey-UAE-Kazakhstan evasion corridor, SWFs (Saudi PIF, UAE ADIA, Norway GPFG, China reserves)
- Has: lat/lon, controller, value, alignment, strategic_value

#### 18. Sanctions Regimes — `sanctions_regimes.json`
- **15 regimes** — imposer, target, type, impact on corridors, severity

#### 19. Regime Changes ��� `regime_changes.json`
- **15 entries** �� country, year, old/new alignment, impact on corridors

#### 20. Shipping Lanes — `shipping_lanes.json`
- **14 lanes** with traffic data, insurance premiums, disruption status
- Covers: Malacca (25% global trade), Suez (disrupted), Cape of Good Hope (surged 40%+), Hormuz (closed Feb 2026), Panama (drought-hit), South China Sea, Baltic, Red Sea/Bab al-Mandab, Trans-Pacific, Trans-Atlantic, Indian Ocean, Arctic NSR, East Africa coastal, Mediterranean
- Has: waypoints, traffic_volume, trade_value, insurance_premium, controller

---

### TECHNOLOGY & CONNECTIVITY

#### 21. Submarine Cables — `submarine_cables.json`
- **24 entries**: Cable systems 12 | Cable chokepoints 5 | Landing stations 4 | Cable events 2
- Covers: MAREA, Dunant, Grace Hopper, 2Africa, PEACE (China), SAIL (Huawei), SEA-ME-WE 5/6, Red Sea cable corridor, Luzon Strait (Taiwan), Baltic sabotage
- Has: lat/lon, waypoints (for cable systems), owner, builder, capacity, color, alignment

#### 22. Space Assets — `space_assets.json`
- **17 entries**: Navigation systems 5 | Constellations 4 | Launch sites 4 | Space weapons 3 | Ground stations 1
- Covers: GPS, BeiDou, GLONASS, NavIC, Galileo, Starlink, China SatNet/Guowang, Yaogan, OneWeb, Cape Canaveral, Baikonur, Wenchang, Sriharikota, China/Russia ASAT tests, X-37B
- Has: lat/lon, operator, capability, alignment

#### 23. Cyber Infrastructure — `cyber_infrastructure.json`
- **15 entries**: 5G networks 3 | Data centers 3 | Surveillance 3 | Cyber operations 4 | Digital policy 2
- Covers: Huawei 5G (banned vs adopted), data centers (Virginia, Singapore, Gulf), NSO Pegasus, Hikvision, Palantir, Volt Typhoon (China), SolarWinds (Russia), Iran cyber, Lazarus Group (DPRK), Great Firewall
- Has: lat/lon, operator, capability, alignment

---

### DIPLOMACY & ALLIANCES

#### 24. Treaties & Alliances — `treaties_alliances.json`
- **18 entries**: Western/Builder 7 | China/Blocker 5 | Regional 3 | Collapsed 2
- Covers: NATO, AUKUS, Quad, Abraham Accords, Five Eyes, EU-India FTA, I2U2, SCO, BRICS+, China-Russia partnership, CPEC, China-Iran 25yr deal, China-Solomon Islands, GCC, AU, ASEAN, Black Sea Grain Initiative (collapsed), JCPOA (collapsed)
- Has: members, status, hq lat/lon, corridor_impact, alignment

---

## REMAINING GAPS (Priority 3 — nice to have)

| Category | Why it matters | Est. entries |
|----------|---------------|--------------|
| **Refugee & migration flows** | Displacement from conflicts creates political pressure (EU migration crisis → policy shifts) | 8–10 |
| **Media & information networks** | Al Jazeera, RT, CGTN, Starlink — who controls the narrative in each theater | 8–10 |
| **Election interference / coups** | Russia in Africa (Wagner coups), China influence ops, US democracy promotion | 8–10 |
| **Insurance & shipping costs** | War risk premiums by route — economic pressure that redirects trade (partially covered in shipping_lanes.json) | 5–8 |

---

## DATA QUALITY — RESOLVED

| Issue | Status |
|-------|--------|
| ~~Missing `theater` + `year` on all 50 moves in standalone~~ | Fixed — synced from master |
| ~~Missing `lat`, `lon`, `country` on ports in standalone~~ | Fixed — synced from master |
| ~~Duplicate PORT OF CHANCAY~~ | Fixed — deduplicated (19 ports now) |
| ~~Duplicate files in `/data` vs `/src/data`~~ | Fixed — consolidated to `/src/data/` only |
| Missing corridor waypoints in master | Use `corridors_geo.json` (20 corridors, full waypoints) |
