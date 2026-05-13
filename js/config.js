/**
 * CONFIG.JS
 * Centralized game configuration (Web Version)
 */

const Config = {
    // Game Info
    GameName: "Lost & Found: Echo Worlds",
    Version: "0.1.0",
    Platform: "Web",
    
    // Canvas Settings
    Canvas: {
        Width: 1280,
        Height: 720,
        BackgroundColor: "#0f1419",
        RenderScale: 1.0,
    },

    // Player Settings
    Player: {
        DefaultWalkSpeed: 5,
        DefaultSprintSpeed: 8,
        MaxHealth: 100,
        MaxStamina: 100,
        StaminaDrainPerFrame: 0.5,
        StaminaRegenPerFrame: 0.3,
        MaxInventorySlots: 20,
        JumpHeight: 10,
        InteractionDistance: 50,
    },

    // NPC Settings
    NPC: {
        SpawnRate: 1.0,
        ConversationDistance: 15,
        PatrolSpeed: 2,
        DetectionRadius: 100,
        MaxNPCs: 50,
        DefaultNPCSize: 40,
    },

    // Item Settings
    Items: {
        SpawnRate: 1.0,
        ItemLifetime: 300, // 5 minutes
        MaxItems: 100,
        DefaultItemSize: 30,
        FloatingHeight: 20,
        FloatingSpeed: 0.05,
    },

    // Memory Echo System
    MemoryEcho: {
        EffectDuration: 10,
        MaxIntensity: 1.0,
        IntensityGrowth: 0.1,
        WorldTransformIntensity: 0.5,
    },

    // Dream World System
    DreamWorld: {
        MaxPlayersPerDream: 5,
        DreamTimeout: 300, // 5 minutes
        PuzzleTimeout: 60,
        RewardMultiplier: 1.5,
        GravityInverted: -9.8,
    },

    // Timeline System
    Timeline: {
        TimelineCount: 3,
        PortalCooldown: 30,
        CorruptionPenalty: -50,
        TimeScale: {
            Past: 0.7,
            Present: 1.0,
            Future: 1.3,
        },
    },

    // Reputation System
    Reputation: {
        ItemReturnedCorrectly: 50,
        ItemReturnedWrong: -30,
        QuestCompleted: 100,
        QuestFailed: -50,
        AchievementUnlocked: 25,
        CheatingDetected: -999,
    },

    // Skill Tree System
    SkillTree: {
        MaxSkillLevel: 10,
        MaxTotalSkillPoints: 100,
        SkillPointPerLevel: 1,
        SkillPointPerReputation: 5, // 1 point per 5 reputation
        ResetCostPerLevel: 10,
    },

    // Event System
    Event: {
        EventDuration: 120, // 2 minutes
        EventCooldown: 300, // 5 minutes
        EventSpawnRate: 0.01, // 1% per frame
        MaxActiveEvents: 3,
        MonsterSpawnChance: 0.3,
    },

    // World Settings
    World: {
        MapSize: 4000,
        MapGridSize: 200,
        AmbientLight: 200,
        DayLength: 1800, // 30 minutes
        DefaultTimeOfDay: 15, // 3 PM
        WeatherChangeInterval: 60,
    },

    // Audio Settings
    Audio: {
        MasterVolume: 0.8,
        MusicVolume: 0.6,
        SFXVolume: 0.8,
        AmbientVolume: 0.4,
        EnableAudio: true,
    },

    // UI Settings
    UI: {
        HUDFadeDelay: 5,
        NotificationDuration: 3,
        TooltipDelay: 0.5,
        DialogueSpeed: 50, // ms per character
        MinimapZoom: 0.5,
    },

    // Graphics Settings
    Graphics: {
        EnableParticles: true,
        EnableGlow: true,
        EnableShadows: false,
        MaxParticles: 1000,
        EffectQuality: "high", // low, medium, high
        ResolutionScale: 1.0,
        FrameRateLimit: 60,
    },

    // Debug Settings
    Debug: true,
    DebugShowFPS: true,
    DebugShowBounds: false,
    DebugShowGrid: false,
    DebugMouseTracking: false,
    ConsoleLogging: true,

    // Performance Settings
    Performance: {
        EnableVSync: true,
        MaxFPS: 60,
        UpdateTickRate: 60,
        RenderDistance: 1000,
        LODDistance: 500,
    },

    // Input Settings
    Input: {
        KeyboardEnabled: true,
        MouseEnabled: true,
        TouchEnabled: true,
        GamepadEnabled: false,
        KeyDelay: 0.1, // Delay between repeated key presses
    },

    // Difficulty Settings
    Difficulty: {
        Level: "Normal", // Easy, Normal, Hard
        EnemyDamageMultiplier: 1.0,
        PlayerDamageMultiplier: 1.0,
        ReputationGainMultiplier: 1.0,
        ItemSpawnMultiplier: 1.0,
    },

    // LocalStorage Keys
    Storage: {
        SaveDataKey: "echow_saves",
        SettingsKey: "echow_settings",
        StatisticsKey: "echow_stats",
        ProfileKey: "echow_profile",
    },

    // Color Schemes
    ColorScheme: "dark", // dark, light, auto

    // Helper function to log config
    Log() {
        if (this.Debug) {
            console.log(`[Config] ${this.GameName} v${this.Version}`);
            console.log(`[Config] Platform: ${this.Platform}`);
            console.log(`[Config] Canvas: ${this.Canvas.Width}x${this.Canvas.Height}`);
        }
    },

    // Helper function to get value
    Get(path) {
        return eval(`this.${path}`);
    },

    // Helper function to set value
    Set(path, value) {
        const parts = path.split('.');
        let obj = this;
        for (let i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
    },
};

// Log config on load
document.addEventListener('DOMContentLoaded', () => {
    Config.Log();
});
