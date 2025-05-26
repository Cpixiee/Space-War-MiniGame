// Core game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = 'menu'; // menu, playing, gameOver, victory
let keys = {};
let bullets = [];
window.enemies = []; // Initialize enemies array in global scope
window.enemyBullets = []; // Initialize enemyBullets array in global scope
let particles = [];
let boss = null;
let score = 0;
let wave = 1;
let enemySpawnTimer = 0;
let stars = [];

// Game objects
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 60,
    height: 50,
    speed: 5,
    health: 100,
    maxHealth: 100,
    shield: false,
    shieldTime: 0,
    design: '',
    damage: 1,
    maxShieldTime: 0
};

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Utility functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Check collisions between game objects
function checkCollisions() {
    // Player bullets with enemies
    for(let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        
        for(let j = window.enemies.length - 1; j >= 0; j--) {
            let enemy = window.enemies[j];
            if(checkCollision(bullet, enemy)) {
                enemy.health -= bullet.damage || 1;
                if(!bullet.isLaser) {
                    bullets.splice(i, 1);
                }
                createHitEffect(bullet.x, bullet.y, bullet.color);
                
                if(enemy.health <= 0) {
                    window.enemies.splice(j, 1);
                    createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
                    score += enemy.points;
                }
                break;
            }
        }
    }
    
    // Enemy bullets with player
    if(!player.shield) {
        for(let i = window.enemyBullets.length - 1; i >= 0; i--) {
            let bullet = window.enemyBullets[i];
            if(checkCollision(bullet, player)) {
                player.health -= 10;
                window.enemyBullets.splice(i, 1);
                createHitEffect(bullet.x, bullet.y, '#ff0000');
                
                if(player.health <= 0) {
                    gameState = 'gameOver';
                    createExplosion(player.x + player.width/2, player.y + player.height/2, '#00ffff', 2);
                    document.getElementById('gameOver').style.display = 'block';
                }
            }
        }
    }
}

// Initialize game elements
function initGameElements() {
    // Show game elements
    canvas.style.display = 'block';
    document.querySelector('.hud').style.display = 'block';
    document.querySelector('.skills-hud').style.display = 'block';
    document.querySelector('.controls').style.display = 'block';
    
    // Hide start menu
    document.getElementById('startMenu').style.display = 'none';
}

// Initialize game
function init() {
    wave = 1;
    score = 0;
    window.enemies = [];
    bullets = [];
    window.enemyBullets = [];
    particles = [];
    
    // Get selected ship from localStorage
    const savedShip = localStorage.getItem('selectedShip');
    if (savedShip) {
        try {
            const shipData = JSON.parse(savedShip);
            console.log('Loading ship:', shipData); // Debug log
            
            // Apply ship properties
            player.speed = shipData.speed;
            player.damage = shipData.damage;
            player.maxShieldTime = shipData.shield * 100;
            player.shieldTime = 0;
            
            // Ensure design is properly copied
            player.design = {
                mainColor: shipData.design.mainColor,
                accentColor: shipData.design.accentColor,
                engineColor: shipData.design.engineColor,
                type: shipData.design.type,
                special: shipData.design.special
            };
            
            console.log('Applied ship design:', player.design); // Debug log
        } catch (error) {
            console.error('Error loading ship:', error);
            // Fallback to default ship
            player.speed = 3;
            player.damage = 3;
            player.maxShieldTime = 300;
            player.design = SHIPS[0].design;
        }
    } else {
        // Set default ship if none selected
        player.speed = 3;
        player.damage = 3;
        player.maxShieldTime = 300;
        player.design = SHIPS[0].design;
    }
    
    player.health = 100;
    resetAllSkills();
    startWave(wave);
    
    // Update wave display
    updateWaveDisplay();
}

// Start game
function startGame() {
    gameState = 'playing';
    initGameElements();
    init();
    
    // Initialize mobile controls if needed
    if (window.mobileControlsHandler && window.mobileControlsHandler.isMobileDevice()) {
        window.mobileControlsHandler.init();
    }
}

// Update wave display
function updateWaveDisplay() {
    const waveText = document.getElementById('wave-text');
    if (waveText) {
        if (wave === 4) {
            waveText.textContent = 'MINI BOSS BATTLE!';
            waveText.style.color = '#8800ff';
        } else if (wave === 5) {
            waveText.textContent = 'FINAL BOSS BATTLE!';
            waveText.style.color = '#ff0088';
        } else {
            waveText.textContent = `Wave ${wave}`;
            waveText.style.color = '#ffffff';
        }
    }
}

// Check wave completion
function checkWaveCompletion() {
    if (window.enemies.length === 0 && remainingEnemies.length === 0) {
        if (wave < 5) {
            wave++;
            startWave(wave);
            updateWaveDisplay();
            
            // Show wave announcement
            const announcement = document.createElement('div');
            announcement.className = 'wave-announcement';
            announcement.textContent = wave === 4 ? 'MINI BOSS APPROACHING!' :
                                    wave === 5 ? 'FINAL BOSS APPROACHING!' :
                                    `WAVE ${wave}`;
            document.body.appendChild(announcement);
            
            // Remove announcement after animation
            setTimeout(() => {
                announcement.remove();
            }, 2000);
        } else if (wave === 5 && gameState === 'playing') {
            // Game victory
            gameState = 'victory';
            document.getElementById('victory').style.display = 'block';
        }
    }
}

// Game restart
function restart() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
    init();
}

// Update HUD
function updateHUD() {
    // Update score
    document.getElementById('score').textContent = `Score: ${score}`;
    
    // Update health text and bar
    const healthText = document.getElementById('health');
    const healthBar = document.getElementById('health-bar');
    
    if (healthText && healthBar) {
        const healthPercentage = (player.health / 100) * 100;
        healthText.textContent = Math.max(0, Math.floor(player.health));
        healthBar.style.width = `${healthPercentage}%`;
        
        // Update health bar color based on health percentage
        if (healthPercentage > 50) {
            healthBar.style.backgroundColor = '#00ff00';
        } else if (healthPercentage > 25) {
            healthBar.style.backgroundColor = '#ffff00';
        } else {
            healthBar.style.backgroundColor = '#ff0000';
        }
    }
    
    // Update wave text
    const waveText = document.getElementById('wave-text');
    if (waveText) {
        if (wave === 4) {
            waveText.textContent = 'MINI BOSS BATTLE!';
            waveText.style.color = '#8800ff';
        } else if (wave === 5) {
            waveText.textContent = 'FINAL BOSS BATTLE!';
            waveText.style.color = '#ff0088';
        } else {
            waveText.textContent = `Wave ${wave}`;
            waveText.style.color = '#ffffff';
        }
    }
    
    // Update skill cooldowns
    updateSkillDisplay();
    
    // Check wave completion
    checkWaveCompletion();
}

// Initialize stars for background
function initStars() {
    stars = [];
    for(let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 2 + 0.5
        });
    }
}

// Event Listeners
document.getElementById('playButton').addEventListener('click', startGame);

// Export necessary functions
window.init = init;
window.updateHUD = updateHUD;
window.restart = restart;
window.gameState = gameState;
window.checkCollisions = checkCollisions;
window.checkCollision = checkCollision;