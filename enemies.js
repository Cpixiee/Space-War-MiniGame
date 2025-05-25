// Enemy types and their properties
const ENEMY_TYPES = {
    SCOUT: {
        width: 40,
        height: 40,
        health: 2,
        speed: 3,
        color: '#ff4444',
        points: 100,
        sprite: `
            .    ▲    .
            ▲   ███   ▲
           ███ █████ ███
          █████████████
           . ██████ .
        `
    },
    FIGHTER: {
        width: 50,
        height: 50,
        health: 4,
        speed: 2,
        color: '#ff8800',
        points: 150,
        sprite: `
           .   ▲   .
          ▲   ███   ▲
         ███ █████ ███
        ████████████
         .  ████  .
            ████
        `
    },
    HEAVY: {
        width: 60,
        height: 60,
        health: 6,
        speed: 1,
        color: '#ff0000',
        points: 200,
        sprite: `
           .   ▲   .
          ▲   ███   ▲
         ███████████
        █████████████
         . ██████ .
           ██████
        `
    },
    MINIBOSS: {
        width: 120,
        height: 100,
        health: 50,
        speed: 2,
        color: '#8800ff',
        points: 500,
        sprite: `
            .     ▲▲▲     .
           ▲    █████    ▲
          ███  ███████  ███
         ████████████████
        ██████████████████
       ████████████████████
        .  ████   ████  .
           ███     ███
        `
    },
    BOSS: {
        width: 180,
        height: 150,
        health: 100,
        speed: 1,
        color: '#ff0088',
        points: 1000,
        sprite: `
             .      ▲▲▲      .
            ▲     █████     ▲
           ███   ███████   ███
          █████████████████████
         ███████████████████████
        █████████████████████████
       ███████████████████████████
        .   ████████████████   .
            ████     ████
             ███     ███
              ██     ██
        `
    }
};

// Wave configurations
const WAVE_CONFIGS = {
    1: {
        enemies: [
            { type: 'SCOUT', count: 5 },
            { type: 'FIGHTER', count: 2 }
        ],
        spawnDelay: 60
    },
    2: {
        enemies: [
            { type: 'SCOUT', count: 6 },
            { type: 'FIGHTER', count: 3 },
            { type: 'HEAVY', count: 1 }
        ],
        spawnDelay: 50
    },
    3: {
        enemies: [
            { type: 'SCOUT', count: 7 },
            { type: 'FIGHTER', count: 4 },
            { type: 'HEAVY', count: 2 }
        ],
        spawnDelay: 40
    },
    4: {
        enemies: [
            { type: 'MINIBOSS', count: 1 }
        ],
        spawnDelay: 0
    },
    5: {
        enemies: [
            { type: 'BOSS', count: 1 }
        ],
        spawnDelay: 0
    }
};

let spawnTimer = 0;
let currentWaveConfig = null;
let remainingEnemies = [];

// Function to start a new wave
function startWave(waveNumber) {
    if (WAVE_CONFIGS[waveNumber]) {
        currentWaveConfig = WAVE_CONFIGS[waveNumber];
        remainingEnemies = [];
        
        // Prepare enemy spawn queue
        for (const enemyGroup of currentWaveConfig.enemies) {
            for (let i = 0; i < enemyGroup.count; i++) {
                remainingEnemies.push(enemyGroup.type);
            }
        }
        
        // Shuffle the enemies for random spawn order (except for boss waves)
        if (waveNumber < 4) {
            remainingEnemies = shuffleArray(remainingEnemies);
        }
        
        spawnTimer = 0;
    }
}

// Function to spawn enemies
function spawnWave() {
    if (!currentWaveConfig || remainingEnemies.length === 0) {
        return;
    }

    spawnTimer++;
    
    if (spawnTimer >= currentWaveConfig.spawnDelay) {
        spawnTimer = 0;
        
        const enemyType = remainingEnemies.pop();
        const enemyProps = ENEMY_TYPES[enemyType];
        
        if (enemyType === 'MINIBOSS' || enemyType === 'BOSS') {
            // Spawn boss in the middle
            const enemy = createEnemy(
                canvas.width / 2 - enemyProps.width / 2,
                -enemyProps.height,
                enemyProps.width,
                enemyProps.height,
                enemyProps.health,
                enemyProps.speed,
                enemyProps.color,
                enemyType.toLowerCase(),
                enemyProps.points
            );
            window.enemies.push(enemy);
        } else {
            // Random x position for regular enemies
            const enemy = createEnemy(
                Math.random() * (canvas.width - enemyProps.width),
                -enemyProps.height,
                enemyProps.width,
                enemyProps.height,
                enemyProps.health,
                enemyProps.speed,
                enemyProps.color,
                enemyType.toLowerCase(),
                enemyProps.points
            );
            window.enemies.push(enemy);
        }
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create enemy with properties
function createEnemy(x, y, width, height, health, speed, color, type, points) {
    return {
        x,
        y,
        width,
        height,
        health,
        speed,
        color,
        type,
        points,
        sprite: ENEMY_TYPES[type.toUpperCase()].sprite,
        update() {
            if (type === 'miniboss') {
                // Mini-boss movement pattern
                this.y = Math.min(this.y + this.speed, canvas.height * 0.2);
                this.x += Math.sin(Date.now() / 1000) * 2;
            } else if (type === 'boss') {
                // Boss movement pattern
                this.y = Math.min(this.y + this.speed, canvas.height * 0.15);
                this.x += Math.sin(Date.now() / 800) * 3;
            } else {
                // Regular enemies movement
                this.y += this.speed;
            }
        },
        draw() {
            // Draw enemy sprite
            const sprite = this.sprite;
            const lines = sprite.trim().split('\n');
            const lineHeight = this.height / lines.length;
            
            ctx.fillStyle = this.color;
            lines.forEach((line, i) => {
                const chars = line.split('');
                const charWidth = this.width / line.length;
                chars.forEach((char, j) => {
                    if (char !== '.' && char !== ' ') {
                        ctx.fillRect(
                            this.x + j * charWidth,
                            this.y + i * lineHeight,
                            charWidth,
                            lineHeight
                        );
                    }
                });
            });
            
            // Draw health bar for bosses
            if (type === 'miniboss' || type === 'boss') {
                const healthPercentage = this.health / ENEMY_TYPES[type.toUpperCase()].health;
                const barWidth = this.width;
                const barHeight = 5;
                
                // Background
                ctx.fillStyle = '#333333';
                ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
                
                // Health
                ctx.fillStyle = type === 'boss' ? '#ff0088' : '#8800ff';
                ctx.fillRect(this.x, this.y - 10, barWidth * healthPercentage, barHeight);
            }
        }
    };
}

// Update enemies
function updateEnemies() {
    // Ensure arrays exist
    if (!window.enemies || !window.enemyBullets) {
        window.enemies = window.enemies || [];
        window.enemyBullets = window.enemyBullets || [];
        return;
    }

    for (let i = window.enemies.length - 1; i >= 0; i--) {
        const enemy = window.enemies[i];
        enemy.update();

        // Remove enemies that are off screen
        if (enemy.y > canvas.height) {
            window.enemies.splice(i, 1);
            continue;
        }

        // Enemy shooting logic
        if (enemy.type === 'miniboss' || enemy.type === 'boss') {
            // Boss shooting patterns
            if (Math.random() < 0.05) { // 5% chance to shoot each frame
                // Create multiple bullets in a spread pattern
                const bulletCount = enemy.type === 'boss' ? 3 : 2;
                const spreadAngle = enemy.type === 'boss' ? 30 : 20;
                
                for (let j = 0; j < bulletCount; j++) {
                    const angle = (j - (bulletCount - 1) / 2) * (spreadAngle / (bulletCount - 1));
                    const radians = angle * Math.PI / 180;
                    
                    const bullet = {
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height,
                        width: 8,
                        height: 8,
                        speed: 5,
                        color: enemy.type === 'boss' ? '#ff0088' : '#8800ff',
                        velocityX: Math.sin(radians) * 5,
                        velocityY: 5
                    };
                    window.enemyBullets.push(bullet);
                }
            }
        } else if (Math.random() < 0.01) { // 1% chance for regular enemies to shoot
            // Regular enemy simple shooting
            const bullet = {
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height,
                width: 4,
                height: 8,
                speed: 4,
                color: enemy.color,
                velocityX: 0,
                velocityY: 4
            };
            window.enemyBullets.push(bullet);
        }
    }

    // Update enemy bullets
    for (let i = window.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = window.enemyBullets[i];
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;

        // Remove bullets that are off screen
        if (bullet.y > canvas.height || 
            bullet.y < 0 || 
            bullet.x < 0 || 
            bullet.x > canvas.width) {
            window.enemyBullets.splice(i, 1);
        }
    }
}

// Draw enemy bullet
function drawEnemyBullet(bullet) {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, 
                 bullet.width, bullet.height);
}

// Export necessary functions and variables
window.startWave = startWave;
window.spawnWave = spawnWave;
window.updateEnemies = updateEnemies;
window.drawEnemyBullet = drawEnemyBullet;