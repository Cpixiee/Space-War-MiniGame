// Initialize game
initStars();

// Mobile controls state
window.mobileControlsState = {
    up: false,
    down: false,
    left: false,
    right: false,
    shooting: false,
    lastTouch: null
};

// Function to toggle mobile controls visibility
function toggleMobileControls(show) {
    const mobileControlsElement = document.querySelector('.mobile-controls');
    if (mobileControlsElement) {
        mobileControlsElement.style.display = show ? 'block' : 'none';
    }
}

// Function to handle touch events
function handleTouchStart(event, control) {
    event.preventDefault();
    event.stopPropagation();
    
    if (gameState !== 'playing') return;

    mobileControlsState.lastTouch = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        control: control
    };

    if (control === 'shoot') {
        keys.Space = true;
        keys.shooting = true;
        mobileControlsState.shooting = true;
    } else if (control === 'Q') {
        keys.KeyQ = true;
        activateRapidFire();
    } else if (control === 'E') {
        keys.KeyE = true;
        activateShield();
        playSound(shieldSound);
    } else if (control === 'F') {
        keys.KeyF = true;
        activateLaserBeam();
        playSound(laserSound);
    } else {
        // Handle directional controls
        switch(control) {
            case 'Up':
                keys.KeyW = true;
                keys.ArrowUp = true;
                mobileControlsState.up = true;
                break;
            case 'Down':
                keys.KeyS = true;
                keys.ArrowDown = true;
                mobileControlsState.down = true;
                break;
            case 'Left':
                keys.KeyA = true;
                keys.ArrowLeft = true;
                mobileControlsState.left = true;
                break;
            case 'Right':
                keys.KeyD = true;
                keys.ArrowRight = true;
                mobileControlsState.right = true;
                break;
        }
    }
}

function handleTouchEnd(event, control) {
    event.preventDefault();
    event.stopPropagation();

    mobileControlsState.lastTouch = null;

    if (control === 'shoot') {
        keys.Space = false;
        keys.shooting = false;
        mobileControlsState.shooting = false;
    } else {
        // Handle directional controls
        switch(control) {
            case 'Up':
                keys.KeyW = false;
                keys.ArrowUp = false;
                mobileControlsState.up = false;
                break;
            case 'Down':
                keys.KeyS = false;
                keys.ArrowDown = false;
                mobileControlsState.down = false;
                break;
            case 'Left':
                keys.KeyA = false;
                keys.ArrowLeft = false;
                mobileControlsState.left = false;
                break;
            case 'Right':
                keys.KeyD = false;
                keys.ArrowRight = false;
                mobileControlsState.right = false;
                break;
            default:
                keys[`Key${control}`] = false;
                break;
        }
    }
}

// Setup mobile controls with improved touch handling
function setupMobileControls() {
    const directions = ['Up', 'Down', 'Left', 'Right'];
    directions.forEach(direction => {
        const button = document.getElementById(`mobile${direction}`);
        if (button) {
            button.addEventListener('touchstart', (e) => handleTouchStart(e, direction), { passive: false });
            button.addEventListener('touchend', (e) => handleTouchEnd(e, direction), { passive: false });
            button.addEventListener('touchcancel', (e) => handleTouchEnd(e, direction), { passive: false });
            
            // Add touch move handling for better responsiveness
            button.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (mobileControlsState.lastTouch && mobileControlsState.lastTouch.control === direction) {
                    const touch = e.touches[0];
                    const buttonRect = button.getBoundingClientRect();
                    
                    // Check if touch is still within button bounds
                    if (touch.clientX < buttonRect.left || touch.clientX > buttonRect.right ||
                        touch.clientY < buttonRect.top || touch.clientY > buttonRect.bottom) {
                        handleTouchEnd(e, direction);
                    }
                }
            }, { passive: false });
        }
    });

    // Action buttons setup
    const actions = {
        'mobileShoot': 'shoot',
        'mobileQ': 'Q',
        'mobileE': 'E',
        'mobileF': 'F'
    };

    Object.entries(actions).forEach(([id, action]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('touchstart', (e) => handleTouchStart(e, action), { passive: false });
            button.addEventListener('touchend', (e) => handleTouchEnd(e, action), { passive: false });
            button.addEventListener('touchcancel', (e) => handleTouchEnd(e, action), { passive: false });
        }
    });
}

// Initialize mobile controls
document.addEventListener('DOMContentLoaded', () => {
    setupMobileControls();
    resizeGame();
    // Hide mobile controls initially
    toggleMobileControls(false);
});

// Prevent default touch behavior
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.mobile-controls')) {
        e.preventDefault();
    }
}, { passive: false });

// Update game size and scale
function resizeGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const isMobile = window.innerWidth <= 768;
    const gameContainer = document.querySelector('body');
    
    if (isMobile) {
        // Calculate the best size while maintaining aspect ratio
        const aspectRatio = 3/4;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Adjust for mobile controls space
        height -= 200; // Reserve space for controls

        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        } else {
            height = width / aspectRatio;
        }

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Set actual canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Update game scale
        window.gameScale = width / 1000; // 1000 is the original width
    } else {
        // Reset to default size for desktop
        canvas.style.width = '1000px';
        canvas.style.height = '700px';
        canvas.width = 1000;
        canvas.height = 700;
        window.gameScale = 1;
    }

    // Update player and game object positions based on new scale
    if (window.player) {
        player.x = (canvas.width / 2) - (player.width / 2);
        player.y = canvas.height - 100;
    }
}

// Call resize on orientation change and window resize
window.addEventListener('resize', resizeGame);
window.addEventListener('orientationchange', resizeGame);

// Audio setup
const shootSound = new Audio('assets/space.mp3');
const rapidFireSound = new Audio('assets/skill_rapid_Q.mp3');
const shieldSound = new Audio('assets/skill_shiled_E.mp3');
const laserSound = new Audio('assets/skill_laser_F.mp3');

// Create multiple sound instances for overlapping effects
const shootSoundPool = Array.from({ length: 5 }, () => {
    const sound = new Audio('assets/space.mp3');
    sound.volume = 0.3; // Reduce volume since multiple sounds will play
    return sound;
});

const rapidFireSoundPool = Array.from({ length: 3 }, () => {
    const sound = new Audio('assets/skill_rapid_Q.mp3');
    sound.volume = 0.3;
    return sound;
});

let currentShootSoundIndex = 0;
let currentRapidSoundIndex = 0;

// Audio control functions
function playShootSound() {
    const sound = shootSoundPool[currentShootSoundIndex];
    sound.currentTime = 0;
    sound.play().catch(error => console.log("Audio play error:", error));
    currentShootSoundIndex = (currentShootSoundIndex + 1) % shootSoundPool.length;
}

function playRapidFireSound() {
    const sound = rapidFireSoundPool[currentRapidSoundIndex];
    sound.currentTime = 0;
    sound.play().catch(error => console.log("Audio play error:", error));
    currentRapidSoundIndex = (currentRapidSoundIndex + 1) % rapidFireSoundPool.length;
}

function playSound(sound) {
    try {
        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio play error:", error);
            });
        }
    } catch (error) {
        console.log("Audio control error:", error);
    }
}

function stopSound(sound) {
    try {
        sound.pause();
        sound.currentTime = 0;
    } catch (error) {
        console.log("Audio stop error:", error);
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Skill activation
    if(gameState === 'playing') {
        switch(e.code) {
            case 'KeyQ':
                activateRapidFire();
                break;
            case 'KeyE':
                activateShield();
                playSound(shieldSound);
                break;
            case 'KeyF':
                activateLaserBeam();
                playSound(laserSound);
                break;
            case 'Space':
                keys.shooting = true;
                break;
        }
    }
    
    // Prevent default space bar scrolling
    if(e.code === 'Space') {
        e.preventDefault();
    }
    
    // Restart game
    if(e.code === 'KeyR' && (gameState === 'gameOver' || gameState === 'victory')) {
        restart();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    if(e.code === 'Space') {
        keys.shooting = false;
    }
});

// Game loop
let lastTime = 0;
let shootTimer = 0;
let shootDelay = 10; // Default shoot delay

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Update mobile controls visibility based on game state
    toggleMobileControls(gameState === 'playing');
    
    if(gameState === 'playing') {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw stars
        updateStars();
        drawStars();
        
        // Update player
        updatePlayer();
        
        // Player shooting
        if(keys.shooting) {
            shootTimer++;
            shootDelay = skills.rapidFire.active ? 3 : 10;
            if(shootTimer >= shootDelay) {
                shoot();
                shootTimer = 0;
                
                // Play sound for main bullet
                playShootSound();
                
                // Additional shots for rapid fire
                if(skills.rapidFire.active) {
                    // Create side bullets
                    bullets.push({
                        x: player.x + player.width / 2 - 15,
                        y: player.y,
                        width: 4,
                        height: 15,
                        speed: 8,
                        color: '#00ffff',
                        damage: 1
                    });
                    bullets.push({
                        x: player.x + player.width / 2 + 15,
                        y: player.y,
                        width: 4,
                        height: 15,
                        speed: 8,
                        color: '#00ffff',
                        damage: 1
                    });
                    // Play rapid fire sound for side bullets
                    playRapidFireSound();
                }
            }
        } else {
            shootTimer = 0;
        }
        
        // Update game objects
        updateBullets();
        updateEnemies();
        updateParticles();
        updateSkills();
        
        // Check collisions
        checkCollisions();
        
        // Spawn enemies
        spawnWave();
        
        // Draw game objects
        drawPlayer();
        
        // Draw bullets
        for(let bullet of bullets) {
            drawBullet(bullet);
        }
        
        // Draw enemy bullets
        for(let bullet of enemyBullets) {
            drawEnemyBullet(bullet);
        }
        
        // Draw enemies
        for(let enemy of enemies) {
            enemy.draw();
        }
        
        // Draw particles
        for(let particle of particles) {
            drawParticle(particle);
        }
        
        // Update HUD
        updateHUD();
    }
    
    requestAnimationFrame(gameLoop);
}

// Collision detection
function checkCollisions() {
    // Player bullets with enemies
    for(let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        
        // Check regular enemies
        for(let j = enemies.length - 1; j >= 0; j--) {
            let enemy = enemies[j];
            if(checkCollision(bullet, enemy)) {
                enemy.health -= bullet.damage || 1;
                if(!bullet.isLaser) {
                    bullets.splice(i, 1);
                }
                createHitEffect(bullet.x, bullet.y, bullet.color);
                
                if(enemy.health <= 0) {
                    enemies.splice(j, 1);
                    createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
                    score += enemy.type === 'heavy' ? 200 : 100;
                }
                break;
            }
        }
        
        // Check boss
        if(boss && checkCollision(bullet, boss)) {
            boss.health -= bullet.damage || 1;
            if(!bullet.isLaser) {
                bullets.splice(i, 1);
            }
            createHitEffect(bullet.x, bullet.y, bullet.color);
            
            if(boss.health <= 0) {
                createExplosion(boss.x + boss.width/2, boss.y + boss.height/2, boss.color, 3);
                boss = null;
                score += 1000;
                wave++;
                
                if(wave > 10) {
                    gameState = 'victory';
                    document.getElementById('victory').style.display = 'block';
                }
            }
        }
    }
    
    // Enemy bullets with player
    if(!player.shield) {
        for(let i = enemyBullets.length - 1; i >= 0; i--) {
            let bullet = enemyBullets[i];
            if(checkCollision(bullet, player)) {
                player.health -= 10;
                enemyBullets.splice(i, 1);
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

// Function to start game
function startGame() {
    gameState = 'playing';
    toggleMobileControls(true);
    // Reset game variables
    score = 0;
    wave = 1;
    enemies = [];
    bullets = [];
    enemyBullets = [];
    particles = [];
    boss = null;
    
    // Reset player
    player.health = 100;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 100;
}

// Function to end game
function endGame() {
    gameState = 'gameOver';
    toggleMobileControls(false);
    document.getElementById('gameOver').style.display = 'block';
}

// Function to handle victory
function victory() {
    gameState = 'victory';
    toggleMobileControls(false);
    document.getElementById('victory').style.display = 'block';
}

// Function to restart game
function restart() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
    startGame();
}

// Start game
requestAnimationFrame(gameLoop); 