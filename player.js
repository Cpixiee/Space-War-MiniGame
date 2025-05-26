// Player movement and shooting
function updatePlayer() {
    if(gameState !== 'playing') return;
    
    // Movement
    if(keys['KeyW'] || keys['ArrowUp']) {
        player.y = Math.max(0, player.y - player.speed);
    }
    if(keys['KeyS'] || keys['ArrowDown']) {
        player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    }
    if(keys['KeyA'] || keys['ArrowLeft']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if(keys['KeyD'] || keys['ArrowRight']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
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
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 4,
        height: 15,
        speed: 8,
        color: player.design ? player.design.engineColor : '#00ffff',
        damage: player.damage || 1
    });
}

// Draw player ship
function drawPlayer() {
    ctx.save();
    
    const px = player.x;
    const py = player.y;
    const design = player.design || {
        mainColor: '#e8e8e8',
        accentColor: '#2196f3',
        engineColor: '#00bfff',
        type: 'aurora',
        special: 'pulse'
    };
    
    // Draw special effect
    ctx.save();
    ctx.translate(px + player.width/2, py + player.height/2);
    drawSpecialEffect(ctx, player, 1);
    ctx.restore();
    
    // Shield effect
    if(player.shield) {
        ctx.strokeStyle = design.engineColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = design.engineColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(px + player.width/2, py + player.height/2, 40, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // Draw ship based on design type
    if (design.type === 'sonic') {
        // Sonic Interceptor
        ctx.fillStyle = design.mainColor;
        
        // Main fuselage
        ctx.beginPath();
        ctx.moveTo(px + 30, py);
        ctx.lineTo(px + 22, py + 35);
        ctx.lineTo(px + 38, py + 35);
        ctx.closePath();
        ctx.fill();

        // Wings
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.moveTo(px + 25, py + 15);
        ctx.lineTo(px + 5, py + 25);
        ctx.lineTo(px + 20, py + 30);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + 35, py + 15);
        ctx.lineTo(px + 55, py + 25);
        ctx.lineTo(px + 40, py + 30);
        ctx.closePath();
        ctx.fill();
        
        // Engine glow
        ctx.fillStyle = design.engineColor;
        ctx.shadowColor = design.engineColor;
        ctx.shadowBlur = 15;
        ctx.fillRect(px + 28, py + 35, 4, 8);
        
        // Sonic trail effect
        if (player.speed > 0) {
            const trail = ctx.createLinearGradient(px + 30, py + 43, px + 30, py + 63);
            trail.addColorStop(0, design.engineColor);
            trail.addColorStop(1, 'rgba(79, 195, 247, 0)');
            ctx.fillStyle = trail;
            ctx.fillRect(px + 25, py + 43, 10, 20);
        }
        
    } else if (design.type === 'dragon') {
        // Dragon Striker
        ctx.fillStyle = design.mainColor;
        
        // Main body
        ctx.beginPath();
        ctx.moveTo(px + 30, py);
        ctx.lineTo(px + 10, py + 35);
        ctx.lineTo(px + 50, py + 35);
        ctx.closePath();
        ctx.fill();

        // Wings
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.moveTo(px + 5, py + 15);
        ctx.lineTo(px, py + 30);
        ctx.lineTo(px + 15, py + 25);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(px + 55, py + 15);
        ctx.lineTo(px + 60, py + 30);
        ctx.lineTo(px + 45, py + 25);
        ctx.closePath();
        ctx.fill();

        // Dragon eyes
        ctx.fillStyle = design.engineColor;
        ctx.beginPath();
        ctx.arc(px + 25, py + 10, 2, 0, Math.PI * 2);
        ctx.arc(px + 35, py + 10, 2, 0, Math.PI * 2);
        ctx.fill();

    } else if (design.type === 'phantom') {
        // Phantom Ghost
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = design.mainColor;
        
        // Stealth body
        ctx.beginPath();
        ctx.moveTo(px + 30, py);
        ctx.lineTo(px + 5, py + 30);
        ctx.lineTo(px + 55, py + 30);
        ctx.closePath();
        ctx.fill();

        // Stealth wings
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.moveTo(px + 15, py + 15);
        ctx.lineTo(px, py + 25);
        ctx.lineTo(px + 20, py + 25);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + 45, py + 15);
        ctx.lineTo(px + 60, py + 25);
        ctx.lineTo(px + 40, py + 25);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;
        
    } else if (design.type === 'titan') {
        // Titan Defender
        ctx.fillStyle = design.mainColor;
        
        // Heavy armor body
        ctx.beginPath();
        ctx.moveTo(px + 30, py);
        ctx.lineTo(px + 10, py + 35);
        ctx.lineTo(px + 50, py + 35);
        ctx.closePath();
        ctx.fill();

        // Armor plates
        ctx.fillStyle = design.accentColor;
        ctx.fillRect(px + 15, py + 10, 30, 5);
        ctx.fillRect(px + 20, py + 20, 20, 5);
        ctx.fillRect(px + 25, py + 30, 10, 5);

    } else {
        // Default Aurora Fighter
        ctx.fillStyle = design.mainColor;
    ctx.beginPath();
    ctx.moveTo(px + 30, py);
    ctx.lineTo(px + 10, py + 35);
    ctx.lineTo(px + 50, py + 35);
    ctx.closePath();
    ctx.fill();
    
        ctx.fillStyle = design.accentColor;
        ctx.fillRect(px + 20, py + 8, 20, 25);
        
        ctx.fillStyle = design.engineColor;
    ctx.beginPath();
    ctx.moveTo(px + 30, py + 2);
    ctx.lineTo(px + 22, py + 15);
    ctx.lineTo(px + 38, py + 15);
    ctx.closePath();
    ctx.fill();
    }
    
    // Engine glow for all ships
        ctx.fillStyle = design.engineColor;
        ctx.shadowColor = design.engineColor;
    ctx.shadowBlur = 15;
    ctx.fillRect(px + 25, py + 35, 4, 8);
    ctx.fillRect(px + 31, py + 35, 4, 8);
    
    ctx.restore();
}

// Update bullets
function updateBullets() {
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
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
        } else {
            bullet.y += bullet.speed;
        }
        
        if(bullet.y > canvas.height || bullet.x < 0 || bullet.x > canvas.width) {
            enemyBullets.splice(i, 1);
        }
    }
}

// Draw bullet
function drawBullet(bullet) {
    ctx.save();
    ctx.fillStyle = bullet.color;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 10;
    ctx.fillRect(bullet.x - bullet.width/2, bullet.y, bullet.width, bullet.height);
    ctx.shadowBlur = 0;
    ctx.restore();
}