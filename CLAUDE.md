on them# CORRIDOR WARS — Interactive Geopolitical Board
## Claude Code Build Plan

### What we're building
An interactive geopolitical strategy board that maps 50 historical moves, 20 ports, 6 chokepoints, and 4 trade corridors across a real world map from 2003–2026. The data is fully extracted and ready.

### Data files (already complete — do not regenerate)
```
data/corridor_wars_data.json   ← MASTER (50MB enriched dataset)
data/corridor_moves.json       ← 50 moves standalone
data/port_data.json            ← 20 ports standalone
```

### Tech stack decision
Use **React + Vite** with:
- `react-leaflet` — interactive map (OpenStreetMap tiles, free, no API key)
- `leaflet` — underlying map engine
- `tailwindcss` — styling
- No backend needed — all data is static JSON

### Project structure
```
corridor-wars-board/
├── CLAUDE.md                  ← this file
├── package.json
├── vite.config.js
├── index.html
├── data/
│   ├── corridor_wars_data.json
│   ├── corridor_moves.json
│   └── port_data.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Map.jsx            ← react-leaflet world map
│   │   ├── PortMarker.jsx     ← port dot on map with popup
│   │   ├── ChokeMarker.jsx    ← chokepoint marker (pulsing red if contested)
│   │   ├── CorridorLine.jsx   ← polyline for each corridor (IMEC blue, BRI red)
│   │   ├── Timeline.jsx       ← horizontal scrubber 2003→2026
│   │   ├── MoveCard.jsx       ← card showing move details
│   │   ├── TheaterFilter.jsx  ← filter by theater / side
│   │   ├── Scoreboard.jsx     ← live blocker vs builder score
│   │   └── DetailPanel.jsx    ← right panel with full move desc
│   ├── hooks/
│   │   ├── useGameState.js    ← current year, selected move, active filters
│   │   └── useFilteredMoves.js
│   ├── utils/
│   │   └── colors.js          ← color constants by team/alignment
│   └── styles/
│       └── index.css
```

---

## SCREEN LAYOUT

```
┌─────────────────────────────────────────────────────────────┐
│  CORRIDOR WARS    [BLOCKER 24] [BUILDER 19] [MIXED 5]  2026 │  ← Header
├──────────────┬──────────────────────────────┬───────────────┤
│              │                              │               │
│  THEATER     │   WORLD MAP (react-leaflet)  │  MOVE DETAIL  │
│  FILTER      │   - Port dots (colored)      │  PANEL        │
│  PANEL       │   - Corridor lines           │               │
│  (left)      │   - Chokepoint markers       │  Selected     │
│              │   - Move events on map       │  move full    │
│  9 theaters  │                              │  description  │
│  + All       │                              │  + impact     │
│              │                              │  + actor      │
├──────────────┴──────────────────────────────┴───────────────┤
│  TIMELINE  [2003]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[2026] ▶  │  ← Scrubber
│            ● ● ●R ● ●D ● ●●●PRE ●●●●●●P ████████████       │
├─────────────────────────────────────────────────────────────┤
│  MOVE FEED  [move cards scrolling left→right by year]       │
└─────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECS

### Map.jsx
```jsx
// react-leaflet MapContainer, centered on [25, 45] (Middle East), zoom 2
// Tile layer: OpenStreetMap (no API key)
// Layers:
//   1. CorridorLine for each corridor (IMEC, BRI, INSTC, Iraq Dev Road)
//   2. ChokeMarker for each of 6 chokepoints
//   3. PortMarker for each of 20 ports (filtered by active theater/side)
//   4. MoveMarker for moves that have geo coordinates (optional phase 2)
```

### PortMarker.jsx
```jsx
// Props: port (from port_data.json)
// Colored circle marker by alignment:
//   china     → red  (#e03131)
//   india     → orange (#e8590c)
//   uae       → gold (#f59f00)
//   western   → blue (#1971c2)
//   state     → green (#2f9e44)
//   mixed     → split color
//   strategic → purple (#7048e8)
// Popup: port name, owner, operator, alignment tag, alert if any
// Size: 8px dot, 12px on hover
```

### CorridorLine.jsx
```jsx
// Props: corridor (from corridors array)
// Polyline connecting route waypoints (approximate lat/lon)
// IMEC: blue, dashed (under construction)
// BRI: red, solid
// INSTC: orange, dashed
// Iraq Dev Road: yellow, dashed
// Tooltip on hover: corridor name, status, signatories
```

### Timeline.jsx
```jsx
// Horizontal range slider 2003→2026
// Below slider: move chips arranged by year
// Color coded by side (red=blocker, blue=builder, gold=mixed)
// Clicking a chip: selects that move, highlights on map, shows in DetailPanel
// Play button: auto-advances year, animates moves appearing
// Move chip tooltip: id + title
```

### MoveCard.jsx / DetailPanel.jsx
```jsx
// Shows selected move:
//   - id badge (R-A, PRE-C, M09 etc)
//   - side badge (BLOCKER/BUILDER/MIXED) with color
//   - theater badge
//   - date
//   - actor
//   - title (large)
//   - desc (full text)
//   - impact (colored box)
//   - related ports (if any)
```

### Scoreboard.jsx
```jsx
// Live count as timeline advances:
//   BLOCKER: X moves executed
//   BUILDER: X moves executed
//   Current year
//   Active chokepoints: X/6 contested
//   IMEC status: [ANNOUNCED / STALLED / CONSTRUCTION / ACTIVE]
```

### TheaterFilter.jsx
```jsx
// 9 theater buttons + All
// Click filters both map markers and timeline chips
// Theater → color dot mapping:
//   ROOT: dark red
//   DEEP: red
//   PRE: orange
//   PROLOGUE: green
//   MIDDLE_EAST: blue
//   WESTERN_HEM: purple
//   SOUTH_ASIA: teal
//   CAUCASUS: amber
//   HORN_AFRICA: pink
```

---

## DATA SCHEMA (already in JSON)

### Move object
```json
{
  "id": "M09",
  "team": "red",
  "date": "Feb 28, 2026",
  "actor": "IRAN — LAST CARD",
  "title": "Strait of Hormuz closed",
  "desc": "Full description text...",
  "impact": "ALL CORRIDORS THREATENED",
  "side": "BLOCKER",        // BLOCKER | BUILDER | MIXED | UNKNOWN
  "theater": "MIDDLE_EAST", // ROOT | DEEP | PRE | PROLOGUE | MIDDLE_EAST | WESTERN_HEM | SOUTH_ASIA | CAUCASUS | HORN_AFRICA
  "year": 2026
}
```

### Port object
```json
{
  "name": "PORT OF HAIFA",
  "location": "Israel — Mediterranean",
  "alignment": "mixed",    // china | india | uae | western | state | mixed | strategic
  "lat": 32.82,
  "lon": 34.99,
  "country": "Israel",
  "details": {
    "OLD PORT": "Adani Ports (India) 70% + Gadot (Israel) 30%...",
    "NEW BAY PORT": "SIPG (China state) 25yr concession to 2040..."
  },
  "tag": "MOST CONTESTED NODE ON THE BOARD",
  "alert": "China operates terminal 1.8km from Israeli navy..."
}
```

### Chokepoint object
```json
{
  "id": "hormuz",
  "name": "Strait of Hormuz",
  "controller": "CONTESTED — Iran closed Feb 2026",
  "traffic": "138 vessels/day, 20% global oil",
  "lat": 26.5,
  "lon": 56.5
}
```

### Corridor waypoints (add these to corridors in the JSON)
```js
// IMEC (blue, dashed)
[[18.95, 72.95], [24.99, 55.06], [24.80, 54.65], [26.43, 50.10], [29.5, 35.0], [32.82, 34.99], [37.95, 23.63], [45.65, 13.77]]

// BRI Maritime (red, solid)  
[[31.23, 121.47], [1.35, 103.82], [11.60, 43.15], [29.97, 32.53], [37.95, 23.63], [51.45, 7.01]]

// INSTC (orange, dashed)
[[18.95, 72.95], [25.29, 57.06], [35.69, 51.39], [55.75, 37.62], [52.37, 4.90]]

// Iraq Dev Road (yellow, dashed)
[[29.98, 48.57], [33.34, 44.40], [36.34, 43.14], [36.89, 36.90], [36.20, 36.16]]
```

---

## BUILD ORDER (recommended for Claude Code)

### Phase 1 — Scaffold + Data
```bash
npm create vite@latest . -- --template react
npm install react-leaflet leaflet tailwindcss @tailwindcss/vite
# Copy JSON files to /data
# Set up Tailwind
# Create App.jsx with layout skeleton (3 columns + timeline row)
```

### Phase 2 — Map + Static Data
```
1. Map.jsx with OpenStreetMap tiles
2. PortMarker.jsx — all 20 ports visible as colored dots
3. CorridorLine.jsx — IMEC + BRI lines visible
4. ChokeMarker.jsx — 6 chokepoints with status
```

### Phase 3 — Timeline + Move Feed
```
1. Timeline.jsx — range slider 2003→2026
2. Move chips appearing below slider
3. Clicking chip → selectedMove state
4. DetailPanel.jsx showing selected move
```

### Phase 4 — Interactivity
```
1. TheaterFilter.jsx — filter ports + moves by theater
2. Side filter — BLOCKER / BUILDER / MIXED
3. Play/pause animation — auto-advance year
4. Scoreboard.jsx — live move counts
```

### Phase 5 — Polish
```
1. Mobile responsive layout
2. Keyboard nav (arrow keys through timeline)
3. Search moves by keyword
4. Export current view as image (optional)
```

---

## KEY DECISIONS ALREADY MADE

- **No API keys needed** — OpenStreetMap tiles are free
- **No backend** — all data is static JSON, loaded at build time
- **react-leaflet** over Mapbox/Google Maps — free, open, no key
- **Vite** over CRA — faster, modern
- **Tailwind** — utility-first, fast iteration
- **JSON is source of truth** — don't hardcode data in components

---

## WHAT THE JSON ALREADY HAS (no regeneration needed)

| Data | Count | Status |
|------|-------|--------|
| Moves with theater tags | 50/50 | ✅ Complete |
| Moves with year field | 50/50 | ✅ Complete |
| Moves with side (BLOCKER/BUILDER/MIXED) | 50/50 | ✅ Complete |
| Moves with full description | 50/50 | ✅ Complete |
| Ports with lat/lon coordinates | 19/20 | ✅ Nearly complete |
| Ports with alignment color | 20/20 | ✅ Complete |
| Ports with owner/operator details | 20/20 | ✅ Complete |
| Chokepoints with lat/lon | 6/6 | ✅ Complete |
| Corridors with route description | 4/4 | ✅ Complete |

The one missing port coordinate is the Chancay duplicate entry — deduplicate it in a data-cleaning step.

---

## FIRST PROMPT TO GIVE CLAUDE CODE

```
Read CLAUDE.md first. Then:

1. Scaffold a React + Vite project in this directory
2. Install react-leaflet, leaflet, tailwindcss
3. Copy the JSON files from /data into the src/data folder
4. Create the 3-column layout in App.jsx (theater filter | map | detail panel)
5. Add a timeline row at the bottom
6. Load corridor_wars_data.json and render all 20 port markers on the map as colored circles
7. Render IMEC as a blue dashed polyline and BRI as a red solid polyline

Don't build interactivity yet — just get the map + data visible first.
```

Then iterate from there phase by phase.
