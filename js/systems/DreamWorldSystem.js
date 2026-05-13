// Stub files for remaining systems
class DreamWorldSystem { Initialize() { } Update(dt) { } }
class ReputationSystem {
    constructor() { this.reputation = 0; }
    Initialize() { }
    Update(dt) { }
    AddReputation(amt) { this.reputation += amt; }
}
class SkillTreeSystem { Initialize() { } Update(dt) { } }
class EventSystem { Initialize() { } Update(dt) { } }
class NPCGenerator { static GenerateNPC(t, p) { return {...t, x:p.x, y:p.y}; } }
class ItemGenerator { static GenerateItem(t, p) { return {...t, x:p.x, y:p.y}; } }
class WorldGenerator {
    constructor(gm) { this.gameManager = gm; }
    GenerateNPCs() { return []; }
    GenerateItems() { return []; }
}
class PlayerController {
    constructor(gm) { this.gameManager = gm; this.keysPressed = {}; }
    HandleKeyDown(e) { this.keysPressed[e.key.toLowerCase()] = true; }
    HandleKeyUp(e) { this.keysPressed[e.key.toLowerCase()] = false; }
    Update(p, dt) { }
}
class UIManager {
    constructor(gm) { this.gameManager = gm; }
    Update(gm) { }
    ShowNotification(m, t) { console.log(`[${t}] ${m}`); }
}
