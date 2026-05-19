# Lost & Found: Echo Worlds — Cyberpunk School Adventure

## Game Overview
A top-down pixel art cyberpunk game set in a futuristic school where players search for lost items and return them to their owners while uncovering mysteries and earning rewards.

## 🎨 Visual Features Implemented

### Neon Cyberpunk Theme
- **Color Palette**: Cyan (#00f5ff), Pink (#ff2d95), Purple (#b24dff), Dark backgrounds
- **Glow Effects**: Multi-layered box-shadows and text-shadows for authentic neon appearance
- **CRT Scanlines**: Repeating linear gradient overlay simulating retro screen effect
- **Vignette**: Radial gradient darkening edges of screen
- **Bloom Simulation**: Drop-shadow filters creating glow spread effect

### Animations (40+ new)
- `glitchFloat`: Floating text with slight glitch effect
- `logoGlow`: Pulsing glow on main logo
- `pulseGlow`: Text glow pulsing between states
- `notifSlide`: Notification sliding in from right
- `echoFade`: Echo memory fade animation
- `dreamPulse`: Dream sequence pulsing effect
- `levelUpPop`: Level-up text pop animation
- `screenShake`: Screen vibration on events
- And 30+ more...

### Weather & Mood Effects
- **Rain Overlay**: Animated rain streaks
- **Fog Effect**: Drifting fog clouds
- **Lightning**: Bright flash effect
- **Mood Filters**: Adjust game mood (sad, happy, mysterious, dangerous)
- **Night Vignette**: Darkened edges at night

### UI Enhancements
- Hologram-style panels with glowing borders
- Interactive buttons with smooth hover animations
- Animated HUD with color-coded stats
- XP bar with glow animation
- Stamina bar with green glow
- Quest tracker with typing-style animation
- Enhanced minimap with legend

### Particle System
- Object pooling for performance
- Glow particles with color variation
- Spark particles for item pickup
- Drift particles for ambient effects
- Customizable lifetime, velocity, acceleration

## 🎮 Game Systems Implemented

### Game State Manager (NEW)
**File**: `js/gameState.js`
- Centralized state management (MENU, PLAYING, PAUSED, SETTINGS)
- Proper pause handling - game loop continues, only updates pause
- Fixes previous pause bugs where inputs would be lost

### Player System
- **Movement**: WASD keyboard controls
- **Sprint**: Shift to sprint (limited by stamina)
- **Stamina System**: Regenerates when not sprinting
- **Animations**: Idle and walking animation frames
- **Direction Indicator**: Visual arrow showing facing direction

### Item System (NEW) `js/itemSystem.js`
- **7 Item Types**:
  - 📚 Buku Tulis (Book) - Normal rarity
  - 📱 Smartphone - Emotional rarity
  - 🔑 Kunci Loker (Key) - Normal rarity
  - 💾 Flashdisk - Supernatural rarity
  - 👛 Dompet (Wallet) - Emotional rarity
  - 🎫 Kartu Pelajar (ID Card) - Normal rarity
  - 💌 Surat Misterius (Letter) - Dangerous rarity

- **Rarity System**:
  - Normal (Gray)
  - Emotional (Pink)
  - Supernatural (Purple)
  - Dangerous (Red)

- **Features**:
  - Glow effects based on rarity
  - Pulse animation
  - Lore/backstory for each item
  - Owner information
  - Monetary value

### Particle System `js/particleSystem.js`
- Spawn glows, sparks, drifts
- Burst effects for item pickup
- Object pooling for performance
- Smooth fade-out animations

### CSS Enhancements
**style.css**: Core styles with enhanced shadows and animations
**ui.css**: Comprehensive UI component styling
**animations.css**: 40+ animation keyframes
**effects.css**: Weather, mood, and visual effect filters

## 🔧 Critical Fixes

### Pause System Fix
**Problem**: Previous implementation stopped requestAnimationFrame, losing input listeners
**Solution**:
```js
loop(timestamp) {
  if (!this.running) return;
  const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
  this.lastTime = timestamp;
  
  // Only update is skipped during pause
  if (!this.dialogue.active && !this.paused && globalGameState.isPlaying()) {
    this.update(dt);
  }
  
  // Render always happens
  this.render();
  
  // Game loop NEVER stops
  requestAnimationFrame(t => this.loop(t));
}
```

## 📊 Features Still To Implement / Enhance

### High Priority
1. **Menu Animations**: Particle background, button glow animations
2. **NPC Enhancement**: Better dialogue system, schedules, reactions
3. **Quest System**: Procedural generation, quest chains
4. **Shop System**: Item preview, purchase confirmation
5. **Skill Tree UI**: Visual branches connecting nodes
6. **Screen Shake**: Event-triggered vibration effects
7. **Sound Effects**: Footsteps, neon hum, pickups

### Medium Priority
1. **Save/Load System**: localStorage persistence
2. **Dialogue System**: Full conversational branching
3. **Map Generation**: Procedural room generation
4. **NPC AI**: Pathfinding, schedules, interactions
5. **Camera Polish**: Smooth follow with easing
6. **UI Polish**: More hologram effects, scanlines on panels

### Lower Priority
1. **Secret Rooms**: Hidden areas with special rewards
2. **Timeline System**: Story branching
3. **Dream World**: Memory sequences
4. **CCTV System**: Security camera interactions
5. **Boss Encounters**: Special NPCs with unique mechanics

## 🚀 How to Run

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge)
2. Click "Start Game" on the main menu
3. Use WASD to move, Shift to sprint
4. Press E to interact with items and NPCs
5. Press I for inventory, K for skills, P for shop
6. Press ESC to pause/unpause

## 🎮 Controls
| Key | Action |
|-----|--------|
| WASD | Move around |
| Shift | Sprint (uses stamina) |
| E | Interact/Pick up items |
| I | Inventory |
| K | Skill Tree |
| P | Shop |
| M | Minimap zoom |
| ESC | Pause/Resume |
| Q | Inspect item memory |
| F | CCTV scanner |
| B | Detective board |

## 📁 Project Structure
```
LostAndFoundEchoWorlds/
├── index.html          # Main HTML file
├── css/
│   ├── style.css       # Core styles (enhanced)
│   ├── ui.css          # UI components (enhanced)
│   ├── animations.css  # Animations (enhanced)
│   └── effects.css     # Visual effects (enhanced)
├── js/
│   ├── game.js         # Main game class
│   ├── gameState.js    # State manager (NEW)
│   ├── player.js       # Player entity
│   ├── particleSystem.js # Particles (NEW)
│   ├── itemSystem.js   # Items (NEW)
│   ├── npc.js          # NPCs
│   ├── world.js        # World/Map
│   ├── dialogue.js     # Dialogue system
│   ├── quests.js       # Quest system
│   ├── inventory.js    # Inventory
│   ├── skillTree.js    # Skill tree
│   ├── shop.js         # Shop system
│   ├── ui.js           # UI manager
│   ├── audio.js        # Audio system
│   ├── movement.js     # Movement system
│   ├── mainMenu.js     # Main menu
│   ├── saveSystem.js   # Save/Load
│   ├── reputation.js   # Reputation tracking
│   ├── weather.js      # Weather system
│   ├── timelineSystem.js # Timeline events
│   ├── eventSystem.js  # Event system
│   ├── minimap.js      # Minimap
│   ├── levelSystem.js  # Leveling system
│   ├── dreamWorld.js   # Dream sequences
│   └── ...
├── assets/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── backgrounds/
│   ├── effects/
│   ├── items/
│   ├── npc/
│   └── ui/
└── save/
    └── localSaveData/
```

## 🎨 Color Variables
```css
--neon-cyan: #00f5ff;
--neon-pink: #ff2d95;
--neon-purple: #b24dff;
--neon-blue: #0080ff;
--neon-green: #00ff88;
--neon-gold: #ffd700;
--bg-dark: #0a0e1a;
--bg-darker: #050609;
--bg-panel: rgba(10, 20, 40, 0.85);
```

## 📝 Implementation Notes

### Pause System Architecture
The new pause system uses a proper state manager to track game state:
```js
globalGameState.setState('PAUSED');  // or 'PLAYING', 'MENU'
if (globalGameState.isPlaying()) {
  // Only runs when not paused
}
```

### Particle System Usage
```js
// Spawn item pickup effect
this.particles.spawnItemPickup(playerX, playerY);

// Spawn custom burst
this.particles.spawnGlowBurst(x, y, 12, ['#00f5ff', '#ff2d95']);
```

### Item System Usage
```js
// Create new item
const item = new Item('flashdisk', {
  x: 500, y: 300, floor: 1,
  lastSeenRoom: 'Lab',
  ownerId: 'npc_123'
});

// Get item at position
const item = itemManager.getItemAt(playerX, playerY, floor, 30);
```

## 🐛 Known Issues & Fixes
- ✓ Pause bug fixed - game loop continues
- ✓ Input not lost during pause/unpause
- ✓ Rendering continues smoothly during pause

## 🎯 Next Steps for Development
1. Test game in browser and verify all systems work
2. Enhance NPC dialogue and interactions
3. Implement quest system features
4. Add sound effects and music
5. Polish UI with more animations
6. Implement save/load functionality
7. Add more item types and rarities
8. Create skill tree visual branches
9. Implement procedural level generation
10. Add story elements and lore

---
**Created with ❤️ using HTML5 Canvas, CSS3, and Vanilla JavaScript**
