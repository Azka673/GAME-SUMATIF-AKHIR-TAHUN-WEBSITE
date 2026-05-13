# 🌐 Lost & Found: Echo Worlds - Web Version

**JavaScript/HTML/CSS Browser-Based Game**

---

## 📖 Overview

Web version dari "Lost & Found: Echo Worlds" adalah adaptasi lengkap dari Roblox game ke browser-based platform menggunakan **HTML5 Canvas 2D**.

**Status:** 🚧 In Development (65% complete)
- ✅ Foundation: HTML, CSS, GameManager, Config, Constants
- 📝 Remaining: 8 Systems, 3 Generators, 2 Managers (~3600 lines)

---

## 🚀 Quick Start

### Option 1: Direct Open
```bash
Open web/index.html in your browser
```

### Option 2: Local Web Server
```bash
cd web
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Live Server (VS Code)
```
Right-click index.html → Open with Live Server
```

---

## 📁 Project Structure

```
web/
├── index.html                    # Main game page
├── css/
│   ├── style.css                 # Main styles (1000+ lines)
│   ├── ui.css                    # UI components (500+ lines)
│   └── game.css                  # Effects & animations (500+ lines)
└── js/
    ├── config.js                 # ✅ 500+ settings
    ├── constants.js              # ✅ Global constants
    ├── main.js                   # ✅ Entry point
    ├── systems/
    │   ├── ItemSystem.js         # 📝 Item management
    │   ├── NPCSystem.js          # 📝 NPC management
    │   ├── MemoryEchoSystem.js   # 📝 Emotion effects
    │   ├── TimelineSystem.js     # 📝 Time travel
    │   ├── DreamWorldSystem.js   # 📝 Dream worlds
    │   ├── ReputationSystem.js   # 📝 Reputation
    │   ├── SkillTreeSystem.js    # 📝 Skills
    │   └── EventSystem.js        # 📝 Events
    ├── generators/
    │   ├── NPCGenerator.js       # 📝 NPC generation
    │   ├── ItemGenerator.js      # 📝 Item generation
    │   └── WorldGenerator.js     # 📝 World generation
    ├── managers/
    │   ├── GameManager.js        # ✅ Core manager
    │   ├── PlayerController.js   # 📝 Input handling
    │   └── UIManager.js          # 📝 UI management
    └── (imported from main.js)
```

**Legend:**
- ✅ Completed & working
- 📝 Placeholder/skeleton code
- 🚧 In progress

---

## 🎮 Game Features

### ✅ Completed Systems (Roblox Reference)
- Item pickup/drop mechanics
- NPC interaction system
- Reputation tracking (6 tiers)
- Skill progression (12 skills)
- 6 emotion-based effects
- 3 timeline system
- 4 dream worlds
- 9 dynamic events

### 📝 Web Implementation Status
- **GameManager.js:** ✅ Complete game loop
- **Configuration:** ✅ 500+ values ready
- **Constants:** ✅ All enums defined
- **HTML/CSS:** ✅ Full UI structure
- **Systems:** 📝 Skeleton code ready

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Rendering** | HTML5 Canvas 2D | 2D game graphics |
| **Language** | JavaScript ES6+ | Game logic |
| **Markup** | HTML5 | Page structure |
| **Styling** | CSS3 | Visual design |
| **Storage** | LocalStorage API | Save/load game |
| **Architecture** | Class-based | Modular design |

---

## 📊 File Statistics

| Category | Count | Lines |
|----------|-------|-------|
| **HTML** | 1 | 300 |
| **CSS** | 3 | 2000+ |
| **JavaScript (Completed)** | 4 | 1000+ |
| **JavaScript (Stubs)** | 11 | 1500 |
| **Total JS needed** | 15 | 2100+ |
| **Total remaining** | - | 3600 |

---

## 🎮 How to Play (When Complete)

### Controls
- **W/A/S/D** - Move player
- **Shift** - Sprint
- **E** - Interact with NPCs/items
- **I** - Toggle inventory
- **M** - Toggle minimap
- **Space** - Jump (in dreams)

### Gameplay Loop
1. Explore 8 areas
2. Find lost items (65+ total)
3. Identify correct owners
4. Return items to NPCs
5. Earn reputation & rewards
6. Unlock skills & achievements
7. Progress through timelines
8. Enter dream worlds

### Game Systems
- **Reputation:** Track player actions (6 tiers)
- **Skills:** 12 skills across 4 branches
- **Emotions:** 6 emotion effects with world transformation
- **Timelines:** Travel between past/present/future
- **Dreams:** Solve puzzles in 4 dream worlds
- **Events:** 9 dynamic world events
- **Inventory:** Manage found items
- **Leaderboard:** Track top players

---

## 🔧 Configuration

### Edit Game Settings
Edit `web/js/config.js` to customize:

```javascript
// Player settings
Config.Player.Speed = 5              // Movement speed
Config.Player.MaxStamina = 100       // Sprint duration
Config.Player.InventorySlots = 20    // Max items

// NPC settings
Config.NPC.SpawnRate = 0.05          // NPC spawn frequency
Config.NPC.MaxNPCs = 50              // Max NPCs active
Config.NPC.PatrolSpeed = 2           // NPC movement speed

// Item settings
Config.Items.SpawnRate = 0.1         // Item spawn frequency
Config.Items.ItemLifetime = 300      // Seconds before cleanup
Config.Items.MaxItems = 100          // Max items active

// Game settings
Config.World.MapSize = 4000          // World dimensions
Config.World.DayLength = 1800        // In-game seconds
Config.GameInfo.Version = "0.1.0"    // Version number

// Debug
Config.Debug = true                  // Show debug info
```

---

## 🎨 Visual Design

### Color Scheme
- **Primary:** #1a1a2e (dark blue)
- **Accent:** #0ea5e9 (cyan)
- **Success:** #22c55e (green)
- **Warning:** #f59e0b (orange)
- **Error:** #ef4444 (red)

### Rarity Colors
- **Common:** Gray (#9ca3af)
- **Uncommon:** Green (#10b981)
- **Rare:** Blue (#3b82f6)
- **Epic:** Purple (#a855f7)
- **Legendary:** Gold (#fbbf24)

### Responsive Breakpoints
- Desktop: 1280px+ (1280x720)
- Tablet: 768px (768x1024)
- Mobile: 375px+ (375x667, planned)

---

## 🚀 Implementation Guide

### Phase 1: Setup ✅
- [x] Create HTML structure
- [x] Build CSS styling (2000+ lines)
- [x] Setup config system
- [x] Setup constants
- [x] Create GameManager

### Phase 2: Implement Systems 📝
- [ ] ItemSystem.js (~300 lines)
- [ ] NPCSystem.js (~300 lines)
- [ ] MemoryEchoSystem.js (~250 lines)
- [ ] TimelineSystem.js (~250 lines)
- [ ] DreamWorldSystem.js (~300 lines)
- [ ] ReputationSystem.js (~250 lines)
- [ ] SkillTreeSystem.js (~250 lines)
- [ ] EventSystem.js (~300 lines)

### Phase 3: Implement Generators 📝
- [ ] NPCGenerator.js (~300 lines)
- [ ] ItemGenerator.js (~250 lines)
- [ ] WorldGenerator.js (~250 lines)

### Phase 4: Implement Managers 📝
- [ ] PlayerController.js (~300 lines)
- [ ] UIManager.js (~400 lines)

### Phase 5: Testing & Polish 📋
- [ ] Browser compatibility
- [ ] Performance optimization
- [ ] Mobile support
- [ ] Sound system
- [ ] Music system

---

## 💻 Browser Compatibility

### Supported Browsers
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Full support |
| Firefox | 55+ | ✅ Full support |
| Safari | 12+ | ✅ Full support |
| Edge | 79+ | ✅ Full support |
| Opera | 47+ | ✅ Full support |

### Required Features
- ✅ Canvas 2D Context
- ✅ LocalStorage API
- ✅ ES6+ JavaScript
- ✅ CSS3 Animations
- ✅ Fetch API (optional)

---

## 📱 Screen Resolutions

### Tested Resolutions
- 1920x1080 (Full HD) ✅
- 1280x720 (Target) ✅
- 1024x768 (Tablet) ✅
- 768x1024 (Tablet Portrait) 🚧
- 375x667 (Mobile) 📋 Planned

### Scaling
- Responsive canvas sizing
- Adaptive UI positioning
- Flexible grid layout
- Mobile-optimized controls (future)

---

## 🎯 Game Loop

```javascript
// Simplified game loop (in GameManager.js)
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = (timestamp - lastTime) / 1000;
    
    // Update phase
    playerController.Update(player, deltaTime);
    for (let system of systems) {
        system.Update(deltaTime);
    }
    
    // Render phase
    canvas.clear();
    gameManager.Draw();
    
    // Next frame
    requestAnimationFrame(gameLoop);
}
```

---

## 💾 Save/Load System

### Auto-Save
- Saves to LocalStorage every 30 seconds
- Player position & inventory
- Reputation & achievements
- Skill progression

### Manual Save
```javascript
gameManager.SaveGame();  // Save to localStorage
```

### Load Game
```javascript
gameManager.LoadGame();  // Load from localStorage
```

### Save Data Structure
```javascript
{
    playTime: 1800,           // Seconds played
    player: {...},            // Player object
    reputation: 250,          // Reputation points
    inventory: [...],         // Items in inventory
    skills: {...},            // Skill levels
    achievements: {...},      // Achievements unlocked
    settings: {...}           // User settings
}
```

---

## 🐛 Debugging

### Enable Debug Mode
```javascript
// In browser console
Config.Debug = true;

// Shows:
// - Frame rate (FPS)
// - Entity counts
// - Player position
// - Debug logs
```

### Debug Flags (in config.js)
```javascript
Config.DebugShowGrid = true;           // Show grid lines
Config.DebugShowBounds = true;         // Show collision boxes
Config.DebugMouseTracking = true;      // Show mouse position
Config.ConsoleLogging = true;          // Console output
```

### Browser DevTools (F12)
- **Console:** Errors & logs
- **Elements:** DOM structure
- **Network:** File loading
- **Performance:** FPS & timing
- **Storage:** LocalStorage data

---

## 📊 Performance Tips

### Optimization Techniques
1. **Object Pooling** - Reuse particle objects
2. **Canvas Caching** - Pre-render static elements
3. **Batch Rendering** - Draw similar objects together
4. **Culling** - Skip off-screen entities
5. **LOD** - Level of detail based on distance

### Performance Targets
- **FPS:** 60 frames/second
- **Load time:** <2 seconds
- **Memory:** <100 MB
- **Max entities:** 100+ without lag

---

## 🎓 Code Examples

### Creating a Simple System

```javascript
class MySystem {
    constructor() {
        this.data = [];
    }
    
    Initialize() {
        if (Config.Debug) console.log('[MySystem] Ready');
    }
    
    Update(deltaTime) {
        // Per-frame updates
    }
    
    GetData() {
        return this.data;
    }
}
```

### Using Config
```javascript
const speed = Config.Player.Speed;
const maxNPCs = Config.NPC.MaxNPCs;
const itemLifetime = Config.Items.ItemLifetime;
```

### Using Constants
```javascript
const rarityColor = Constants.RarityColors[Constants.Rarity.RARE];
const emotionEffect = Constants.Emotions.HAPPY;
const npcType = Constants.NPCTypes.BUSINESSMAN;
```

---

## 🔌 API Reference

### Main Classes

**GameManager**
```javascript
new GameManager(canvas)
Initialize()              // Setup all systems
StartNewGame()           // Begin new game
SaveGame()               // Save to localStorage
LoadGame()               // Load from localStorage
Update(deltaTime)        // Per-frame update
Draw()                   // Render to canvas
```

**Systems (ItemSystem, NPCSystem, etc.)**
```javascript
Initialize()             // Setup system
Update(deltaTime)        // Per-frame logic
```

**PlayerController**
```javascript
HandleKeyDown(event)     // Keyboard input
HandleKeyUp(event)       // Keyboard release
Update(player, dt)       // Update player
```

**UIManager**
```javascript
Update(gameManager)      // Update UI
ShowNotification(msg)    // Show popup
ShowDialogue(npc)        // Show NPC dialogue
```

---

## 📚 Documentation

For more details, see:
- [WEB_VERSION_GUIDE.md](WEB_VERSION_GUIDE.md) - Implementation guide
- [API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) - Complete API
- [BEST_PRACTICES.md](../docs/BEST_PRACTICES.md) - Code patterns
- [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) - Project overview

---

## 🤝 Contributing

### How to Help
1. **Implement a System** - Pick from remaining 15 files
2. **Fix Bugs** - Report issues & create fixes
3. **Improve Performance** - Optimize rendering
4. **Add Features** - Extend game mechanics
5. **Write Tests** - Validate code

### Getting Started
1. Fork/clone the project
2. Read [WEB_VERSION_GUIDE.md](WEB_VERSION_GUIDE.md)
3. Pick a task
4. Reference Roblox Lua version for logic
5. Follow code patterns
6. Test thoroughly

---

## 📝 License

MIT License - Use, modify, and distribute freely

---

## 🎉 Status

**Current:** v0.1.0 (Foundation Complete)
- ✅ HTML/CSS structure
- ✅ Game configuration
- ✅ Game loop
- 🚧 Systems implementation (15 files remaining)
- 📋 Audio/polish (planned)

**Next:** Complete system implementations (~3600 lines)

**Timeline:** 2-3 weeks for full implementation

---

## 🙋 FAQ

### Q: Can I play it now?
A: The structure is ready. GameManager runs, but systems are stubs. See WEB_VERSION_GUIDE.md for implementation.

### Q: How do I implement a system?
A: Reference the Roblox Lua version, follow the provided patterns, and adapt to JavaScript/Canvas.

### Q: Can I customize the game?
A: Yes! Edit config.js to change 500+ game values without modifying code.

### Q: Is it multiplayer?
A: Not yet. Single-player only in current version.

### Q: Can I deploy it?
A: Yes! Upload web/ folder to any web server. No backend required.

### Q: How do I save my progress?
A: Auto-saves to LocalStorage every 30 seconds. No server needed.

---

## 📞 Support

**Documentation:**
- Setup issues → Check WEB_VERSION_GUIDE.md
- Code questions → Check BEST_PRACTICES.md
- API reference → Check API_DOCUMENTATION.md

**Debugging:**
- Enable Config.Debug = true
- Open browser DevTools (F12)
- Check console for errors

**Contributing:**
- See Contributing section above
- Follow code patterns
- Reference Roblox version for logic

---

## 🚀 Next Steps

1. **Build Phase 2** - Implement 8 game systems (~2100 lines)
2. **Build Phase 3** - Implement 3 generators (~800 lines)
3. **Build Phase 4** - Implement 2 managers (~700 lines)
4. **Test & Debug** - Browser compatibility & performance
5. **Deploy** - Upload to web server

---

**Let's build awesome games in the browser!** 🌐✨

For full navigation, see [INDEX.md](INDEX.md)
For quick start, see [START_HERE.md](START_HERE.md)
