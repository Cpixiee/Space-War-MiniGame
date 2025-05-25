// Create explosion particles
function createExplosion(x, y, color, size = 1) {
    const particleCount = 15 * size;
    for(let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i;
        const speed = 1 + Math.random() * 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 2 * size,
            color: color,
            life: 60,
            maxLife: 60
        });
    }
}

// Update particles
function updateParticles() {
    for(let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if(particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Draw particles
function drawParticle(particle) {
    ctx.save();
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Update stars background
function updateStars() {
    for(let star of stars) {
        star.y += star.speed;
        if(star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

// Draw stars
function drawStars() {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for(let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// Create hit effect
function createHitEffect(x, y, color) {
    const particleCount = 5;
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: 1 + Math.random(),
            color: color,
            life: 30,
            maxLife: 30
        });
    }
}

// Draw health bar
function drawHealthBar(x, y, width, height, health, maxHealth, color) {
    ctx.save();
    
    // Background
    ctx.fillStyle = '#440000';
    ctx.fillRect(x, y, width, height);
    
    // Health
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * (health / maxHealth), height);
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    ctx.restore();
}

// Special effects for each ship type
function drawSpecialEffect(ctx, ship, scale = 1) {
    switch(ship.design.special) {
        case 'pulse':
            drawPulseEffect(ctx, ship, scale);
            break;
        case 'sonic':
            drawSonicEffect(ctx, ship, scale);
            break;
        case 'flame':
            drawFlameEffect(ctx, ship, scale);
            break;
        case 'shield':
            drawShieldEffect(ctx, ship, scale);
            break;
    }
}

// Pulse effect for Aurora Fighter
function drawPulseEffect(ctx, ship, scale) {
    const time = Date.now() / 1000;
    const pulseSize = Math.sin(time * 2) * 5 * scale;
    const alpha = (Math.sin(time * 2) + 1) / 2;

    ctx.save();
    ctx.strokeStyle = ship.design.engineColor;
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = alpha;

    // Inner pulse ring
    ctx.beginPath();
    ctx.arc(0, 0, (30 + pulseSize) * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Outer pulse ring
    ctx.beginPath();
    ctx.arc(0, 0, (40 + pulseSize) * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Energy trails
    const trailCount = 8;
    for(let i = 0; i < trailCount; i++) {
        const angle = (i / trailCount) * Math.PI * 2 + time;
        const x1 = Math.cos(angle) * 20 * scale;
        const y1 = Math.sin(angle) * 20 * scale;
        const x2 = Math.cos(angle) * (35 + pulseSize) * scale;
        const y2 = Math.sin(angle) * (35 + pulseSize) * scale;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    ctx.restore();
}

// Sonic effect for Sonic Interceptor
function drawSonicEffect(ctx, ship, scale) {
    const time = Date.now() / 1000;
    
    ctx.save();
    ctx.strokeStyle = ship.design.engineColor;
    ctx.lineWidth = 2 * scale;

    // Sonic wave rings
    for(let i = 0; i < 3; i++) {
        const offset = (time * 2 + i * 0.3) % 1;
        const size = (20 + offset * 30) * scale;
        const alpha = 1 - offset;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(0, 0, size, -Math.PI * 0.6, Math.PI * 0.6);
        ctx.stroke();
    }

    // Speed lines
    const lineCount = 6;
    for(let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI - Math.PI / 2;
        const waveOffset = Math.sin(time * 10 + i) * 5 * scale;

        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 20 * scale, Math.sin(angle) * 20 * scale);
        ctx.lineTo(
            Math.cos(angle) * 40 * scale + waveOffset,
            Math.sin(angle) * 40 * scale
        );
        ctx.stroke();
    }

    ctx.restore();
}

// Flame effect for Dragon Striker
function drawFlameEffect(ctx, ship, scale) {
    const time = Date.now() / 1000;
    
    ctx.save();
    
    // Create flame gradient
    const gradient = ctx.createLinearGradient(0, -20 * scale, 0, 20 * scale);
    gradient.addColorStop(0, ship.design.engineColor);
    gradient.addColorStop(1, '#ff0000');

    // Draw flame trails
    for(let i = 0; i < 3; i++) {
        const offset = Math.sin(time * 10 + i * 5) * 5 * scale;
        const size = (15 + Math.sin(time * 5 + i) * 5) * scale;

        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.7;

        // Left flame
        ctx.beginPath();
        ctx.moveTo(-20 * scale, 0);
        ctx.quadraticCurveTo(
            -20 * scale + offset, 10 * scale,
            -30 * scale, 20 * scale
        );
        ctx.lineTo(-10 * scale, 0);
        ctx.fill();

        // Right flame
        ctx.beginPath();
        ctx.moveTo(20 * scale, 0);
        ctx.quadraticCurveTo(
            20 * scale - offset, 10 * scale,
            30 * scale, 20 * scale
        );
        ctx.lineTo(10 * scale, 0);
        ctx.fill();
    }

    // Dragon energy orbs
    const orbCount = 4;
    for(let i = 0; i < orbCount; i++) {
        const angle = time * 2 + (i / orbCount) * Math.PI * 2;
        const x = Math.cos(angle) * 25 * scale;
        const y = Math.sin(angle) * 25 * scale;
        const size = (3 + Math.sin(time * 5 + i) * 2) * scale;

        ctx.fillStyle = ship.design.engineColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// Shield effect for Titan Defender
function drawShieldEffect(ctx, ship, scale) {
    const time = Date.now() / 1000;
    
    ctx.save();
    
    // Shield barrier
    const shieldRadius = 35 * scale;
    const segments = 12;
    
    for(let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;
        const offset = Math.sin(time * 3 + i) * 5 * scale;
        
        ctx.beginPath();
        ctx.strokeStyle = ship.design.engineColor;
        ctx.lineWidth = (3 + Math.sin(time * 2 + i) * 2) * scale;
        ctx.globalAlpha = 0.5 + Math.sin(time * 2 + i) * 0.3;
        
        ctx.arc(0, 0, shieldRadius + offset, angle, nextAngle);
        ctx.stroke();
    }

    // Energy nodes
    const nodeCount = 6;
    for(let i = 0; i < nodeCount; i++) {
        const angle = time + (i / nodeCount) * Math.PI * 2;
        const x = Math.cos(angle) * shieldRadius;
        const y = Math.sin(angle) * shieldRadius;
        const size = (4 + Math.sin(time * 3 + i) * 2) * scale;

        ctx.fillStyle = ship.design.engineColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nodes with energy lines
        if (i > 0) {
            const prevAngle = time + ((i - 1) / nodeCount) * Math.PI * 2;
            const prevX = Math.cos(prevAngle) * shieldRadius;
            const prevY = Math.sin(prevAngle) * shieldRadius;

            ctx.beginPath();
            ctx.strokeStyle = ship.design.engineColor;
            ctx.lineWidth = 2 * scale;
            ctx.globalAlpha = 0.3;
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    ctx.restore();
}

// Export functions
window.drawSpecialEffect = drawSpecialEffect;