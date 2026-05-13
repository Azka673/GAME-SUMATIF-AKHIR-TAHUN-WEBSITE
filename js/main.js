/**
 * MAIN.JS
 * Main entry point for web version
 */

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('[Main] Canvas not found!');
        return;
    }

    // Initialize game manager
    window.gameManager = new GameManager(canvas);

    // Log initialization
    if (Config.Debug) {
        console.log('=========================================');
        console.log(`🎮 ${Config.GameName} v${Config.Version}`);
        console.log(`📱 Platform: ${Config.Platform}`);
        console.log(`📐 Canvas: ${canvas.width}x${canvas.height}`);
        console.log('=========================================');
        console.log('[Main] Game initialized successfully');
    }

    // Handle visibility change (pause when not focused)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && window.gameManager.isRunning) {
            window.gameManager.PauseGame();
        }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
        window.gameManager.SaveGame();
    });
});

// Handle errors
window.addEventListener('error', (event) => {
    console.error('[Main] Error:', event.error);
    if (Config.Debug) {
        const message = `[ERROR] ${event.error.message}`;
        const logEntry = document.createElement('div');
        logEntry.className = 'log-error';
        logEntry.textContent = message;
        const consoleOutput = document.getElementById('consoleOutput');
        if (consoleOutput) {
            consoleOutput.appendChild(logEntry);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
    }
});

// Prevent right-click context menu in game
document.addEventListener('contextmenu', (e) => {
    if (e.target === document.getElementById('gameCanvas')) {
        e.preventDefault();
    }
});
