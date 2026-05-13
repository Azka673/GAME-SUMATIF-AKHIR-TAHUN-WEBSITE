/**
 * CONSTANTS.JS
 * Global game constants and enums (Web Version)
 */

const Constants = {
    // ========== RARITY SYSTEM ==========
    Rarity: {
        COMMON: 1,
        UNCOMMON: 2,
        RARE: 3,
        EPIC: 4,
        LEGENDARY: 5,
    },

    RarityNames: {
        1: "Common",
        2: "Uncommon",
        3: "Rare",
        4: "Epic",
        5: "Legendary",
    },

    RarityColors: {
        1: "#95a5a6",      // Gray
        2: "#2ecc71",      // Green
        3: "#3498db",      // Blue
        4: "#9b59b6",      // Purple
        5: "#f1c40f",      // Yellow
    },

    // ========== EMOTION SYSTEM ==========
    Emotions: {
        HAPPY: 1,
        SAD: 2,
        ANGRY: 3,
        MYSTERIOUS: 4,
        NOSTALGIC: 5,
        SCARED: 6,
    },

    EmotionNames: {
        1: "Happy",
        2: "Sad",
        3: "Angry",
        4: "Mysterious",
        5: "Nostalgic",
        6: "Scared",
    },

    EmotionEmojis: {
        1: "😊",
        2: "😢",
        3: "😠",
        4: "🌙",
        5: "🍂",
        6: "😨",
    },

    EmotionColors: {
        1: { r: 243, g: 156, b: 18 },      // Orange (Happy)
        2: { r: 52, g: 152, b: 219 },      // Blue (Sad)
        3: { r: 231, g: 76, b: 60 },       // Red (Angry)
        4: { r: 155, g: 89, b: 182 },      // Purple (Mysterious)
        5: { r: 230, g: 126, b: 34 },      // Orange (Nostalgic)
        6: { r: 52, g: 73, b: 94 },        // Dark Blue (Scared)
    },

    EmotionEffects: {
        1: { weather: "sunny", lighting: 1.2, particles: "sparkles" },           // Happy
        2: { weather: "rainy", lighting: 0.8, particles: "teardrops" },          // Sad
        3: { weather: "stormy", lighting: 1.3, particles: "fire" },              // Angry
        4: { weather: "foggy", lighting: 0.9, particles: "glitch" },             // Mysterious
        5: { weather: "sunset", lighting: 1.0, particles: "leaves" },            // Nostalgic
        6: { weather: "night", lighting: 0.6, particles: "shadows" },            // Scared
    },

    // ========== NPC TYPES ==========
    NPCTypes: {
        KID: "kid",
        BUSINESSMAN: "businessman",
        MERCHANT: "merchant",
        ELDERLY: "elderly",
        MONSTER: "monster",
        SPIRIT: "spirit",
    },

    NPCTypeEmojis: {
        kid: "👦",
        businessman: "💼",
        merchant: "🏪",
        elderly: "👴",
        monster: "👹",
        spirit: "👻",
    },

    NPCTypeColors: {
        kid: "#f1c40f",         // Yellow
        businessman: "#2c3e50", // Dark Gray
        merchant: "#2ecc71",    // Green
        elderly: "#95a5a6",     // Gray
        monster: "#e74c3c",     // Red
        spirit: "#ecf0f1",      // White
    },

    // ========== ITEM TYPES ==========
    ItemTypes: {
        PERSONAL: "personal",
        VALUABLE: "valuable",
        SENTIMENTAL: "sentimental",
        MYSTERIOUS: "mysterious",
        SUPERNATURAL: "supernatural",
    },

    ItemTypeEmojis: {
        personal: "📱",
        valuable: "💰",
        sentimental: "📸",
        mysterious: "🔮",
        supernatural: "✨",
    },

    // ========== REPUTATION TIERS ==========
    ReputationTiers: {
        NOTORIOUS: { min: -1000, max: -500, title: "Notorious", emoji: "👿" },
        DISLIKED: { min: -500, max: -100, title: "Disliked", emoji: "😠" },
        NEUTRAL: { min: -100, max: 100, title: "Neutral", emoji: "😐" },
        LIKED: { min: 100, max: 500, title: "Liked", emoji: "😊" },
        TRUSTED: { min: 500, max: 1000, title: "Trusted", emoji: "🤝" },
        LEGENDARY: { min: 1000, max: Infinity, title: "Legendary", emoji: "⭐" },
    },

    ReputationBenefits: {
        Notorious: { discountPercent: -50, questMultiplier: 0.5, inventorySlots: 5 },
        Disliked: { discountPercent: -25, questMultiplier: 0.75, inventorySlots: 10 },
        Neutral: { discountPercent: 0, questMultiplier: 1.0, inventorySlots: 15 },
        Liked: { discountPercent: 10, questMultiplier: 1.2, inventorySlots: 18 },
        Trusted: { discountPercent: 25, questMultiplier: 1.5, inventorySlots: 20 },
        Legendary: { discountPercent: 50, questMultiplier: 2.0, inventorySlots: 25 },
    },

    // ========== TIMELINE SYSTEM ==========
    Timelines: {
        PAST: 1,
        PRESENT: 2,
        FUTURE: 3,
    },

    TimelineNames: {
        1: "Past",
        2: "Present",
        3: "Future",
    },

    TimelineYears: {
        1: "50 Years Ago",
        2: "Now",
        3: "100 Years Ahead",
    },

    TimelineEffects: {
        1: { filter: "grayscale(1) sepia(0.5)", darken: 0.2 },   // Past
        2: { filter: "none", darken: 0 },                         // Present
        3: { filter: "hue-rotate(180deg)", darken: -0.3 },        // Future
    },

    // ========== DREAM WORLDS ==========
    DreamWorlds: {
        UPSIDE_DOWN: "upside_down",
        SKY_OCEAN: "sky_ocean",
        DARK_FOREST: "dark_forest",
        NO_GRAVITY: "no_gravity",
    },

    DreamWorldNames: {
        upside_down: "Upside Down City",
        sky_ocean: "Sky Ocean",
        dark_forest: "Dark Forest",
        no_gravity: "No Gravity City",
    },

    DreamWorldEmojis: {
        upside_down: "🙃",
        sky_ocean: "☁️",
        dark_forest: "🌲",
        no_gravity: "🚀",
    },

    // ========== SKILLS ==========
    Skills: {
        Detective: {
            CLUE_FINDER: "clue_finder",
            DEDUCTION: "deduction",
            PERCEPTION: "perception",
        },
        Courier: {
            SPEED: "speed",
            STAMINA: "stamina",
            INVENTORY: "inventory",
        },
        Tech: {
            HACKING: "hacking",
            GADGETS: "gadgets",
            DRONES: "drones",
        },
        Spirit: {
            SPIRIT_SENSE: "spirit_sense",
            CORRUPTION_RESIST: "corruption_resist",
            DREAM_DEPTH: "dream_depth",
        },
    },

    SkillNames: {
        clue_finder: "Clue Finder",
        deduction: "Deduction",
        perception: "Perception",
        speed: "Speed",
        stamina: "Stamina",
        inventory: "Inventory",
        hacking: "Hacking",
        gadgets: "Gadgets",
        drones: "Drones",
        spirit_sense: "Spirit Sense",
        corruption_resist: "Corruption Resist",
        dream_depth: "Dream Depth",
    },

    // ========== EVENTS ==========
    Events: {
        HEAVY_RAIN: "heavy_rain",
        THUNDERSTORM: "thunderstorm",
        HEAVY_FOG: "heavy_fog",
        FESTIVAL: "festival",
        CONCERT: "concert",
        TRAIN_CRASH: "train_crash",
        PORTAL_LEAK: "portal_leak",
        SHADOW_INVASION: "shadow_invasion",
        METEOR_RAIN: "meteor_rain",
    },

    EventNames: {
        heavy_rain: "Heavy Rain",
        thunderstorm: "Thunderstorm",
        heavy_fog: "Heavy Fog",
        festival: "Festival",
        concert: "Concert",
        train_crash: "Train Crash",
        portal_leak: "Portal Leak",
        shadow_invasion: "Shadow Invasion",
        meteor_rain: "Meteor Rain",
    },

    EventEmojis: {
        heavy_rain: "🌧️",
        thunderstorm: "⛈️",
        heavy_fog: "🌫️",
        festival: "🎉",
        concert: "🎵",
        train_crash: "🚂",
        portal_leak: "🌀",
        shadow_invasion: "👥",
        meteor_rain: "☄️",
    },

    // ========== AREAS ==========
    Areas: {
        DOWNTOWN: "downtown",
        MARKET: "market",
        SCHOOL: "school",
        PARK: "park",
        ALLEY: "alley",
        SUBWAY: "subway",
        HARBOR: "harbor",
        FOREST: "forest",
    },

    AreaNames: {
        downtown: "Downtown",
        market: "Market",
        school: "School",
        park: "Park",
        alley: "Alley",
        subway: "Subway",
        harbor: "Harbor",
        forest: "Forest",
    },

    AreaEmojis: {
        downtown: "🏙️",
        market: "🏪",
        school: "🏫",
        park: "🌳",
        alley: "🏚️",
        subway: "🚇",
        harbor: "⛴️",
        forest: "🌲",
    },

    // ========== DIALOGUE ==========
    DialogueTypes: {
        GREETING: "greeting",
        QUEST: "quest",
        ITEM_RETURN: "item_return",
        FAREWELL: "farewell",
        RUMOR: "rumor",
    },

    // ========== SOUND EFFECT IDs ==========
    Sounds: {
        UI_CLICK: "ui_click",
        UI_OPEN: "ui_open",
        UI_CLOSE: "ui_close",
        ITEM_PICKUP: "item_pickup",
        ITEM_DROP: "item_drop",
        NPC_TALK: "npc_talk",
        EMOTION_HAPPY: "emotion_happy",
        EMOTION_SAD: "emotion_sad",
        EMOTION_ANGRY: "emotion_angry",
        EMOTION_MYSTERIOUS: "emotion_mysterious",
        EMOTION_NOSTALGIC: "emotion_nostalgic",
        EMOTION_SCARED: "emotion_scared",
        FOOTSTEP: "footstep",
        SPRINT: "sprint",
        JUMP: "jump",
    },

    // ========== ACHIEVEMENT ==========
    Achievements: {
        FIRST_ITEM: "first_item",
        ITEM_COLLECTOR: "item_collector",
        HELPER: "helper",
        SPEED_DELIVERY: "speed_delivery",
        DREAM_EXPLORER: "dream_explorer",
        TIME_TRAVELER: "time_traveler",
        REPUTATION_MASTER: "reputation_master",
        SKILL_MASTER: "skill_master",
    },

    AchievementNames: {
        first_item: "First Item",
        item_collector: "Item Collector",
        helper: "Helper",
        speed_delivery: "Speed Delivery",
        dream_explorer: "Dream Explorer",
        time_traveler: "Time Traveler",
        reputation_master: "Reputation Master",
        skill_master: "Skill Master",
    },

    // ========== STATE ENUMS ==========
    PlayerState: {
        IDLE: "idle",
        WALKING: "walking",
        RUNNING: "running",
        JUMPING: "jumping",
        FALLING: "falling",
        INTERACTING: "interacting",
        DEAD: "dead",
    },

    NPCState: {
        IDLE: "idle",
        PATROLLING: "patrolling",
        TALKING: "talking",
        SAD: "sad",
        PANICKED: "panicked",
        DEAD: "dead",
    },

    ItemState: {
        SPAWNED: "spawned",
        HELD: "held",
        DROPPED: "dropped",
        RETURNED: "returned",
        DESPAWNED: "despawned",
    },

    // ========== DIRECTIONS ==========
    Directions: {
        UP: { x: 0, y: -1, angle: 0 },
        DOWN: { x: 0, y: 1, angle: 180 },
        LEFT: { x: -1, y: 0, angle: 270 },
        RIGHT: { x: 1, y: 0, angle: 90 },
    },

    // ========== Helper Functions ==========
    GetRarityColor(rarity) {
        return this.RarityColors[rarity] || this.RarityColors[1];
    },

    GetEmotionColor(emotion) {
        const emotionColor = this.EmotionColors[emotion];
        return emotionColor 
            ? `rgb(${emotionColor.r}, ${emotionColor.g}, ${emotionColor.b})`
            : "rgb(255, 255, 255)";
    },

    GetTimelineFilter(timeline) {
        return this.TimelineEffects[timeline]?.filter || "none";
    },

    IsRareLoot(rarity) {
        return rarity >= this.Rarity.RARE;
    },

    CalculateLevelFromReputation(reputation) {
        const tiers = Object.values(this.ReputationTiers);
        for (const tier of tiers) {
            if (reputation >= tier.min && reputation < tier.max) {
                return tier;
            }
        }
        return tiers[tiers.length - 1];
    },
};

// Log constants on load
if (Config.Debug) {
    console.log("[Constants] Loaded successfully");
}
