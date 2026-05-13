// UIManager.js - Placeholder
class UIManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }
    Update(gameManager) { }
    UpdateHUD() { }
    UpdateMinimap() { }
    ShowNotification(message, type = 'info') { console.log(`[${type}] ${message}`); }
    ShowDialogue(npc) { }
    CloseDialogue() { }
    OpenInventory() { }
    CloseInventory() { }
}
