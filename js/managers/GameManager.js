/**
 * GAMEMANAGER.JS
 * Central game manager that coordinates all systems (Web Version)
 */

class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = false;
        this.isPaused = false;
        
        // Game state
        this.gameState = 'menu'; // menu, loading, playing, paused, gameOver
        this.playTime = 0;
        this.deltaTime = 0;
        this.lastFrameTime = Date.now();
        
        // Systems
        this.systems = {};
        this.managers = {};
        
        // Game objects
        this.player = null;
        this.npcs = [];
        this.items = [];
        this.events = [];
        
        // Initialize
        this.Initialize();
    }

    Initialize() {
        if (Config.Debug) {
            console.log(`[GameManager] Initializing ${Config.GameName} v${Config.Version}`);
        }

        // Resize canvas
        this.ResizeCanvas();
        window.addEventListener('resize', () => this.ResizeCanvas());

        // Initialize all systems
        this.systems.ItemSystem = new ItemSystem();
        this.systems.NPCSystem = new NPCSystem();
        this.systems.MemoryEchoSystem = new MemoryEchoSystem();
        this.systems.TimelineSystem = new TimelineSystem();
        this.systems.DreamWorldSystem = new DreamWorldSystem();
        this.systems.ReputationSystem = new ReputationSystem();
        this.systems.SkillTreeSystem = new SkillTreeSystem();
        this.systems.EventSystem = new EventSystem();

        // Initialize managers
        this.managers.PlayerController = new PlayerController(this);
        this.managers.UIManager = new UIManager(this);
        this.managers.WorldGenerator = new WorldGenerator(this);

        // Generators
        this.npcs = this.managers.WorldGenerator.GenerateNPCs();
        this.items = this.managers.WorldGenerator.GenerateItems();

        // Create player
        this.CreatePlayer();

        // Setup event listeners
        this.SetupEventListeners();

        if (Config.Debug) {
            console.log('[GameManager] ✅ Initialization complete');
        }
    }

    CreatePlayer() {
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            width: 30,
            height: 40,
            vx: 0,
            vy: 0,
            angle: 0,
            speed: Config.Player.DefaultWalkSpeed,
            sprintSpeed: Config.Player.DefaultSprintSpeed,
            health: Config.Player.MaxHealth,
            stamina: Config.Player.MaxStamina,
            inventory: [],
            isSprinting: false,
            isJumping: false,
            isMoving: false,
        };
    }

    SetupEventListeners() {
        // Menu buttons
        document.getElementById('newGameBtn').addEventListener('click', () => this.StartNewGame());
        document.getElementById('continueBtn').addEventListener('click', () => this.LoadGame());
        document.getElementById('settingsBtn').addEventListener('click', () => this.OpenSettings());

        // Settings
        document.getElementById('applySettings').addEventListener('click', () => this.ApplySettings());
        document.getElementById('backToMenu').addEventListener('click', () => this.ShowMenu());

        // Inventory
        document.getElementById('closeInventory').addEventListener('click', () => this.managers.UIManager.CloseInventory());

        // Dialogue
        document.getElementById('closeDialogue').addEventListener('click', () => this.managers.UIManager.CloseDialogue());

        // Keyboard input
        document.addEventListener('keydown', (e) => this.managers.PlayerController.HandleKeyDown(e));
        document.addEventListener('keyup', (e) => this.managers.PlayerController.HandleKeyUp(e));

        // Mouse input
        this.canvas.addEventListener('click', (e) => this.HandleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.HandleMouseMove(e));
    }

    StartNewGame() {
        if (Config.Debug) console.log('[GameManager] Starting new game');

        document.getElementById('menuScreen').classList.add('hidden');
        document.getElementById('loadingScreen').classList.remove('hidden');

        // Simulate loading
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) progress = 100;
            document.getElementById('loadingBar').style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                this.StartGame();
            }
        }, 200);
    }

    LoadGame() {
        if (Config.Debug) console.log('[GameManager] Loading game...');
        // TODO: Load from localStorage
        this.StartNewGame();
    }

    OpenSettings() {
        document.getElementById('menuScreen').classList.add('hidden');
        document.getElementById('settingsScreen').classList.remove('hidden');
    }

    ApplySettings() {
        Config.Audio.MasterVolume = document.getElementById('masterVolume').value / 100;
        Config.Audio.MusicVolume = document.getElementById('musicVolume').value / 100;
        Config.Audio.SFXVolume = document.getElementById('sfxVolume').value / 100;
        Config.Debug = document.getElementById('debugMode').checked;

        if (Config.Debug) console.log('[GameManager] Settings applied');
    }

    ShowMenu() {
        document.getElementById('settingsScreen').classList.add('hidden');
        document.getElementById('menuScreen').classList.remove('hidden');
    }

    StartGame() {
        if (Config.Debug) console.log('[GameManager] Game started');

        this.gameState = 'playing';
        this.isRunning = true;

        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('menuScreen').classList.add('hidden');

        // Start game loop
        this.gameLoop();
    }

    PauseGame() {
        this.isPaused = !this.isPaused;
        this.gameState = this.isPaused ? 'paused' : 'playing';
    }

    gameLoop() {
        if (!this.isRunning) return;

        // Calculate delta time
        const now = Date.now();
        this.deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        if (!this.isPaused) {
            this.playTime += this.deltaTime;

            // Update
            this.Update();

            // Draw
            this.Draw();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    Update() {
        // Update player
        this.managers.PlayerController.Update(this.player, this.deltaTime);

        // Update NPCs
        for (let npc of this.npcs) {
            this.UpdateNPC(npc);
        }

        // Update items
        for (let item of this.items) {
            this.UpdateItem(item);
        }

        // Update systems
        for (let system in this.systems) {
            if (this.systems[system].Update) {
                this.systems[system].Update(this.deltaTime);
            }
        }

        // Update UI
        this.managers.UIManager.Update(this);
    }

    UpdateNPC(npc) {
        // Simple NPC movement
        if (npc.targetX !== undefined && npc.targetY !== undefined) {
            const dx = npc.targetX - npc.x;
            const dy = npc.targetY - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                const speed = npc.speed || 2;
                npc.x += (dx / distance) * speed * this.deltaTime;
                npc.y += (dy / distance) * speed * this.deltaTime;
                npc.angle = Math.atan2(dy, dx);
            } else {
                npc.targetX = undefined;
                npc.targetY = undefined;
            }
        }
    }

    UpdateItem(item) {
        // Float animation
        item.floatTime = (item.floatTime || 0) + this.deltaTime;
        item.floatY = item.startY + Math.sin(item.floatTime * 2) * 10;
    }

    Draw() {
        // Clear canvas
        this.ctx.fillStyle = Config.Canvas.BackgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid (debug)
        if (Config.DebugShowGrid) {
            this.DrawGrid();
        }

        // Draw game objects
        this.DrawNPCs();
        this.DrawItems();
        this.DrawPlayer();

        // Draw debug info
        if (Config.Debug) {
            this.DrawDebugInfo();
        }
    }

    DrawGrid() {
        this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
        this.ctx.lineWidth = 1;

        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    DrawPlayer() {
        const p = this.player;

        // Player body
        this.ctx.fillStyle = '#0ea5e9';
        this.ctx.fillRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);

        // Player outline
        this.ctx.strokeStyle = '#06b6d4';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);

        // Sprint indicator
        if (p.isSprinting) {
            this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.width / 2 + 10, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    DrawNPCs() {
        for (let npc of this.npcs) {
            // NPC body
            this.ctx.fillStyle = npc.color || '#2ecc71';
            this.ctx.fillRect(npc.x - 15, npc.y - 20, 30, 40);

            // NPC outline
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(npc.x - 15, npc.y - 20, 30, 40);

            // NPC label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(npc.name, npc.x, npc.y - 30);

            // Detection radius (debug)
            if (Config.DebugShowBounds) {
                this.ctx.strokeStyle = 'rgba(46, 204, 113, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(npc.x, npc.y, Config.NPC.DetectionRadius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }

    DrawItems() {
        for (let item of this.items) {
            // Item body
            this.ctx.fillStyle = item.color || '#f1c40f';
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.floatY || item.y, item.size / 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Item glow (legendary)
            if (item.rarity === Constants.Rarity.LEGENDARY) {
                this.ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(item.x, item.floatY || item.y, item.size / 2 + 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            // Item label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 8px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.emoji || '📦', item.x, item.y + 2);
        }
    }

    DrawDebugInfo() {
        this.ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        let y = 20;
        const debugInfo = [
            `FPS: ${Math.round(1 / this.deltaTime)}`,
            `Play Time: ${Math.round(this.playTime)}s`,
            `Player: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
            `NPCs: ${this.npcs.length}`,
            `Items: ${this.items.length}`,
            `Stamina: ${Math.round(this.player.stamina)}/${Config.Player.MaxStamina}`,
        ];

        for (let info of debugInfo) {
            this.ctx.fillText(info, 10, y);
            y += 18;
        }
    }

    HandleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (Config.Debug) {
            console.log(`[GameManager] Click at (${Math.round(x)}, ${Math.round(y)})`);
        }

        // Check if clicked on NPC
        for (let npc of this.npcs) {
            const dx = npc.x - x;
            const dy = npc.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < 30) {
                this.managers.UIManager.ShowDialogue(npc);
                return;
            }
        }

        // Check if clicked on item
        for (let item of this.items) {
            const dx = item.x - x;
            const dy = item.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                this.systems.ItemSystem.PickupItem(item, this.player);
                return;
            }
        }

        // Otherwise move player
        this.player.targetX = x;
        this.player.targetY = y;
    }

    HandleMouseMove(event) {
        if (Config.DebugMouseTracking) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log(`[GameManager] Mouse at (${Math.round(x)}, ${Math.round(y)})`);
        }
    }

    ResizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    SaveGame() {
        if (Config.Debug) console.log('[GameManager] Saving game...');
        const saveData = {
            playTime: this.playTime,
            player: this.player,
            reputation: this.systems.ReputationSystem.reputation,
            inventory: this.player.inventory,
        };
        localStorage.setItem(Config.Storage.SaveDataKey, JSON.stringify(saveData));
    }

    LoadGameData() {
        if (Config.Debug) console.log('[GameManager] Loading game data...');
        const saveData = localStorage.getItem(Config.Storage.SaveDataKey);
        if (saveData) {
            const data = JSON.parse(saveData);
            this.playTime = data.playTime;
            this.player = { ...this.player, ...data.player };
            return data;
        }
        return null;
    }

    Quit() {
        this.SaveGame();
        this.isRunning = false;
        console.log('[GameManager] Game closed');
    }
}
