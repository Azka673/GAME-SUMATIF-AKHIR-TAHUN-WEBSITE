/**
 * NPSYSTEM.JS (WEB VERSION)
 * Manages NPCs with daily schedules, moods, and interactions
 * TODO: Implement all methods
 */

class NPCSystem {
    constructor() {
        this.npcs = [];
        this.npcTemplates = [
            { id: 1, name: "Tommy", type: Constants.NPCTypes.KID, mood: "happy", age: 8 },
            { id: 2, name: "John", type: Constants.NPCTypes.BUSINESSMAN, mood: "neutral", age: 45 },
            { id: 3, name: "Maria", type: Constants.NPCTypes.MERCHANT, mood: "happy", age: 35 },
            { id: 4, name: "Elder", type: Constants.NPCTypes.ELDERLY, mood: "sad", age: 75 },
        ];
    }

    Initialize() {
        if (Config.Debug) console.log('[NPCSystem] Initialized');
    }

    Update(deltaTime) {
        // TODO: Update NPC schedules
        // TODO: Update NPC moods
        // TODO: Handle random item loss events
    }

    CreateNPC(template, position) {
        // TODO: Create NPC object
        // TODO: Add to npcs array
    }

    InteractWithNPC(npc, player) {
        // TODO: Show dialogue
        // TODO: Check for item returns
        // TODO: Update reputation
    }

    GetNPCsInRadius(position, radius) {
        // TODO: Return nearby NPCs
    }

    MoveNPCToward(npc, targetPos, speed) {
        // TODO: Move NPC towards target
    }

    NPCLosesItem(npc) {
        // TODO: Random item loss
    }

    NPCFindsItem(npc, item) {
        // TODO: NPC finds returned item
    }
}
