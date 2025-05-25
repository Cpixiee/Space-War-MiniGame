// Player movement and shooting
function updatePlayer() {
    if(gameState !== 'playing') return;
    
    const scale = window.gameScale || 1;
    const baseSpeed = player.speed * scale;
    const diagonalSpeed = baseSpeed * 0.707; // Approximately 1/√2 for diagonal movement
    
    // Track if we're moving diagonally
    const isMovingHorizontal = (keys['KeyA'] || keys['ArrowLeft']) || (keys['KeyD'] || keys['ArrowRight']);
    const isMovingVertical = (keys['KeyW'] || keys['ArrowUp']) || (keys['KeyS'] || keys['ArrowDown']);
    const isDiagonal = isMovingHorizontal && isMovingVertical;
    
    // Calculate actual speed based on movement type
    const speed = isDiagonal ? diagonalSpeed : baseSpeed;
    
    // Movement with improved mobile responsiveness
    if(keys['KeyW'] || keys['ArrowUp']) {
        player.y = Math.max(0, player.y - speed);
    }
    if(keys['KeyS'] || keys['ArrowDown']) {
        player.y = Math.min(canvas.height - player.height * scale, player.y + speed);
    }
    if(keys['KeyA'] || keys['ArrowLeft']) {
        player.x = Math.max(0, player.x - speed);
    }
    if(keys['KeyD'] || keys['ArrowRight']) {
        player.x = Math.min(canvas.width - player.width * scale, player.x + speed);
    }
    
    // Update shield
    if(player.shield) {
        player.shieldTime--;
        if(player.shieldTime <= 0) {
            player.shield = false;
        }
    }
}

// Player shooting
function shoot() {
    const scale = window.gameScale || 1;
    
    // Create main bullet
    bullets.push({
        x: player.x + player.width * scale / 2 - 2 * scale,
        y: player.y,
        width: 4 * scale,
        height: 15 * scale,
        speed: 10 * scale,
        color: '#00ffff',
        damage: player.damage
    });
}

// Draw player ship based on design type
function drawPlayer() {
    const scale = window.gameScale || 1;
    
    ctx.save();
    ctx.translate(player.x + (player.width * scale) / 2, player.y + (player.height * scale) / 2);
    
    // Draw special effect behind the ship
    if (typeof drawSpecialEffect === 'function') {
        drawSpecialEffect(ctx, player, scale);
    }
    
    switch(player.design.type) {
        case 'dragon':
            // Dragon Striker design
            ctx.fillStyle = player.design.mainColor;
            
            // Dragon head
            ctx.beginPath();
            ctx.moveTo(0, -30 * scale);
            ctx.lineTo(-15 * scale, -15 * scale);
            ctx.lineTo(15 * scale, -15 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Dragon body
            ctx.beginPath();
            ctx.moveTo(-15 * scale, -15 * scale);
            ctx.lineTo(-20 * scale, 20 * scale);
            ctx.lineTo(20 * scale, 20 * scale);
            ctx.lineTo(15 * scale, -15 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Dragon wings
            ctx.fillStyle = player.design.accentColor;
            // Left wing
            ctx.beginPath();
            ctx.moveTo(-15 * scale, -5 * scale);
            ctx.lineTo(-45 * scale, 5 * scale);
            ctx.lineTo(-35 * scale, 15 * scale);
            ctx.lineTo(-15 * scale, 10 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Right wing
            ctx.beginPath();
            ctx.moveTo(15 * scale, -5 * scale);
            ctx.lineTo(45 * scale, 5 * scale);
            ctx.lineTo(35 * scale, 15 * scale);
            ctx.lineTo(15 * scale, 10 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Dragon eyes
            ctx.fillStyle = player.design.engineColor;
            ctx.beginPath();
            ctx.arc(-8 * scale, -20 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.arc(8 * scale, -20 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'sonic':
            // Sonic Interceptor design
            ctx.fillStyle = player.design.mainColor;
            
            // Sleek body
            ctx.beginPath();
            ctx.moveTo(0, -35 * scale);
            ctx.quadraticCurveTo(-15 * scale, -10 * scale, -10 * scale, 20 * scale);
            ctx.lineTo(10 * scale, 20 * scale);
            ctx.quadraticCurveTo(15 * scale, -10 * scale, 0, -35 * scale);
            ctx.fill();
            
            // Accent stripes
            ctx.strokeStyle = player.design.accentColor;
            ctx.lineWidth = 3 * scale;
            ctx.beginPath();
            ctx.moveTo(-8 * scale, -20 * scale);
            ctx.lineTo(-12 * scale, 15 * scale);
            ctx.moveTo(8 * scale, -20 * scale);
            ctx.lineTo(12 * scale, 15 * scale);
            ctx.stroke();
            break;
            
        case 'titan':
            // Titan Defender design
            ctx.fillStyle = player.design.mainColor;
            
            // Heavy armor body
            ctx.beginPath();
            ctx.moveTo(0, -25 * scale);
            ctx.lineTo(-25 * scale, -15 * scale);
            ctx.lineTo(-30 * scale, 20 * scale);
            ctx.lineTo(30 * scale, 20 * scale);
            ctx.lineTo(25 * scale, -15 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Armor plates
            ctx.fillStyle = player.design.accentColor;
            ctx.fillRect(-35 * scale, -10 * scale, 70 * scale, 5 * scale);
            ctx.fillRect(-30 * scale, 0 * scale, 60 * scale, 5 * scale);
            ctx.fillRect(-25 * scale, 10 * scale, 50 * scale, 5 * scale);
            break;
            
        default: // Aurora Fighter (default)
            // Draw ship base
            ctx.fillStyle = player.design.mainColor;
            ctx.beginPath();
            ctx.moveTo(0, -30 * scale);
            ctx.lineTo(-20 * scale, 5 * scale);
            ctx.lineTo(20 * scale, 5 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Draw ship details
            ctx.fillStyle = player.design.accentColor;
            ctx.beginPath();
            ctx.moveTo(0, -25 * scale);
            ctx.lineTo(-8 * scale, -10 * scale);
            ctx.lineTo(8 * scale, -10 * scale);
            ctx.closePath();
            ctx.fill();
    }
    
    // Engine glow (common for all ships)
    ctx.fillStyle = player.design.engineColor;
    ctx.shadowColor = player.design.engineColor;
    ctx.shadowBlur = 15 * scale;
    ctx.fillRect(-10 * scale, 8 * scale, 4 * scale, 8 * scale);
    ctx.fillRect(6 * scale, 8 * scale, 4 * scale, 8 * scale);
    
    // Draw shield if active
    if(player.shield) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2 * scale;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10 * scale;
        ctx.beginPath();
        ctx.arc(0, 0, 40 * scale, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Update bullets
function updateBullets() {
    const scale = window.gameScale || 1;
    
    // Player bullets
    for(let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if(bullets[i].y < -bullets[i].height) {
            bullets.splice(i, 1);
        }
    }
    
    // Enemy bullets
    for(let i = enemyBullets.length - 1; i >= 0; i--) {
        let bullet = enemyBullets[i];
        if(bullet.vx !== undefined) {
            bullet.x += bullet.vx * scale;
            bullet.y += bullet.vy * scale;
        } else {
            bullet.y += bullet.speed * scale;
        }
        
        if(bullet.y > canvas.height || bullet.x < 0 || bullet.x > canvas.width) {
            enemyBullets.splice(i, 1);
        }
    }
}

// Draw bullet
function drawBullet(bullet) {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

// Export necessary functions
window.updatePlayer = updatePlayer;
window.drawPlayer = drawPlayer;
window.shoot = shoot;
window.updateBullets = updateBullets;
window.drawBullet = drawBullet;