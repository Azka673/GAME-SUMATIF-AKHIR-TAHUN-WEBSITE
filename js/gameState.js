/**
 * Game State Manager — Centralized state and pause system
 * Fixes: Pause system properly maintains game loop while pausing updates
 */

export class GameStateManager {
  constructor() {
    this.state = 'MENU'; // MENU, LOADING, PLAYING, PAUSED, SETTINGS
    this.isPaused = false;
    this.isGameRunning = false;
    this.isPanelOpen = false;
    this.listeners = [];
  }

  setState(newState) {
    if (this.state === newState) return;
    const oldState = this.state;
    this.state = newState;
    this.notifyListeners('stateChange', { oldState, newState });

    switch (newState) {
      case 'PAUSED':
        this.isPaused = true;
        break;
      case 'PLAYING':
        this.isPaused = false;
        this.isGameRunning = true;
        break;
      case 'MENU':
        this.isGameRunning = false;
        this.isPaused = false;
        break;
    }
  }

  pause() {
    if (this.state === 'PLAYING') {
      this.setState('PAUSED');
      this.notifyListeners('pause');
    }
  }

  resume() {
    if (this.state === 'PAUSED') {
      this.setState('PLAYING');
      this.notifyListeners('resume');
    }
  }

  isPlaying() {
    return this.state === 'PLAYING';
  }

  isPausedState() {
    return this.state === 'PAUSED';
  }

  // For tracking if any UI panel is open (inventory, shop, etc)
  setPanelOpen(isOpen) {
    this.isPanelOpen = isOpen;
    this.notifyListeners('panelStateChange', { isPanelOpen: isOpen });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(event, data = {}) {
    this.listeners.forEach(listener => listener({ event, data }));
  }
}

export const globalGameState = new GameStateManager();
