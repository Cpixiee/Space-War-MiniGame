// Enhanced ship configurations
const SHIPS = [
    {
        id: 'default',
        name: 'Aurora Fighter',
        description: 'Pesawat seimbang dengan kemampuan adaptif di segala situasi. Dilengkapi dengan teknologi shield generasi terbaru.',
        speed: 3,
        damage: 3,
        shield: 3,
        design: {
            mainColor: '#e8e8e8',
            accentColor: '#2196f3',
            engineColor: '#00bfff',
            type: 'aurora',
            special: 'pulse'
        }
    },
    {
        id: 'sonic',
        name: 'Sonic Interceptor',
        description: 'Pesawat interceptor supersonik dengan desain aerodinamis. Memiliki kecepatan ekstrim dan kemampuan penetrasi pertahanan musuh.',
        speed: 6,
        damage: 4,
        shield: 2,
        design: {
            mainColor: '#ffffff',
            accentColor: '#1a237e',
            engineColor: '#4fc3f7',
            type: 'sonic',
            special: 'sonic'
        }
    },
    {
        id: 'dragon',
        name: 'Dragon Striker',
        description: 'Pesawat tempur dengan desain naga futuristik. Dilengkapi dengan sistem persenjataan plasma dan kemampuan serangan dahsyat.',
        speed: 4,
        damage: 5,
        shield: 3,
        design: {
            mainColor: '#ff3333',
            accentColor: '#aa0000',
            engineColor: '#ff8888',
            type: 'dragon',
            special: 'flame'
        }
    },
    {
        id: 'phantom',
        name: 'Phantom Ghost',
        description: 'Pesawat siluman dengan teknologi stealth terbaru. Kemampuan menghilang dan muncul tiba-tiba membuat musuh kebingungan.',
        speed: 5,
        damage: 3,
        shield: 2,
        design: {
            mainColor: '#2c3e50',
            accentColor: '#34495e',
            engineColor: '#9b59b6',
            type: 'phantom',
            special: 'stealth'
        }
    },
    {
        id: 'titan',
        name: 'Titan Defender',
        description: 'Pesawat tempur dengan armor terkuat. Dilengkapi dengan shield generator dan sistem pertahanan berlapis.',
        speed: 2,
        damage: 3,
        shield: 6,
        design: {
            mainColor: '#ffaa00',
            accentColor: '#ff8800',
            engineColor: '#ffdd00',
            type: 'titan',
            special: 'shield'
        }
    }
];

let currentShipIndex = 0;
let selectedShip = SHIPS[0];
let animationFrame;
let previewStars = [];
let shipHoverEffect = 0;
let selectionParticles = [];

// Initialize
function init() {
    createThumbnails();
    updateShipDisplay();
    setupEventListeners();
    initPreviewStars();
    animatePreview();
}

// Initialize preview stars
function initPreviewStars() {
    previewStars = [];
    const canvas = document.getElementById('shipPreview');
    for(let i = 0; i < 50; i++) {
        previewStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 2 + 0.5
        });
    }
}

// Update preview stars
function updatePreviewStars() {
    const canvas = document.getElementById('shipPreview');
    for(let star of previewStars) {
        star.y += star.speed;
        if(star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

// Draw preview stars
function drawPreviewStars(ctx) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for(let star of previewStars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// Create selection particles
function createSelectionParticles(x, y, color) {
    for(let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i;
        selectionParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            size: 2 + Math.random() * 2,
            color: color,
            life: 60,
            maxLife: 60
        });
    }
}

// Update selection particles
function updateSelectionParticles() {
    for(let i = selectionParticles.length - 1; i >= 0; i--) {
        const particle = selectionParticles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        if(particle.life <= 0) {
            selectionParticles.splice(i, 1);
        }
    }
}

// Draw selection particles
function drawSelectionParticles(ctx) {
    for(let particle of selectionParticles) {
        ctx.save();
        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Create ship thumbnails
function createThumbnails() {
    const container = document.getElementById('shipThumbnails');
    SHIPS.forEach((ship, index) => {
        const thumbnail = document.createElement('canvas');
        thumbnail.className = 'ship-thumbnail';
        thumbnail.width = 80;
        thumbnail.height = 60;
        thumbnail.addEventListener('click', () => selectShip(index));
        thumbnail.addEventListener('mouseover', () => {
            thumbnail.style.transform = 'scale(1.1)';
            createSelectionParticles(
                thumbnail.offsetLeft + thumbnail.width/2,
                thumbnail.offsetTop + thumbnail.height/2,
                ship.design.engineColor
            );
        });
        thumbnail.addEventListener('mouseout', () => {
            thumbnail.style.transform = '';
        });
        container.appendChild(thumbnail);
        drawShipThumbnail(thumbnail, ship.design);
    });
    updateThumbnailSelection();
}

// Draw ship thumbnail
function drawShipThumbnail(canvas, design) {
    const ctx = canvas.getContext('2d');
    const scale = 0.4;
    
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    drawShipBase(ctx, design, scale);
    ctx.restore();
}

// Draw enhanced ship design
function drawShipBase(ctx, design, scale = 1) {
    ctx.save();
    
    if (design.type === 'dragon') {
        // Dragon Striker design
        ctx.fillStyle = design.mainColor;
        
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
        ctx.fillStyle = design.accentColor;
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
        ctx.fillStyle = design.engineColor;
        ctx.beginPath();
        ctx.arc(-8 * scale, -20 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.arc(8 * scale, -20 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Engine flames
        drawFlameEffect(ctx, scale, design);
        
    } else if (design.type === 'phantom') {
        // Phantom Ghost design
        ctx.fillStyle = design.mainColor;
        ctx.globalAlpha = 0.8;
        
        // Stealth body
        ctx.beginPath();
        ctx.moveTo(0, -30 * scale);
        ctx.lineTo(-30 * scale, 10 * scale);
        ctx.lineTo(-20 * scale, 20 * scale);
        ctx.lineTo(20 * scale, 20 * scale);
        ctx.lineTo(30 * scale, 10 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Stealth panels
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.moveTo(-25 * scale, 0);
        ctx.lineTo(-35 * scale, 15 * scale);
        ctx.lineTo(-15 * scale, 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(25 * scale, 0);
        ctx.lineTo(35 * scale, 15 * scale);
        ctx.lineTo(15 * scale, 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1;
        drawStealthEffect(ctx, scale, design);
        
    } else if (design.type === 'titan') {
        // Titan Defender design
        ctx.fillStyle = design.mainColor;
        
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
        ctx.fillStyle = design.accentColor;
        ctx.fillRect(-35 * scale, -10 * scale, 70 * scale, 5 * scale);
        ctx.fillRect(-30 * scale, 0 * scale, 60 * scale, 5 * scale);
        ctx.fillRect(-25 * scale, 10 * scale, 50 * scale, 5 * scale);
        
        // Shield effect
        drawShieldEffect(ctx, scale, design);
        
    } else if (design.type === 'sonic') {
        // Sonic Interceptor
        ctx.fillStyle = design.mainColor;
        
        // Main fuselage
        ctx.beginPath();
        ctx.moveTo(0, -35 * scale);
        ctx.lineTo(-8 * scale, 25 * scale);
        ctx.lineTo(8 * scale, 25 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Wings
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.moveTo(-5 * scale, 0);
        ctx.lineTo(-25 * scale, 15 * scale);
        ctx.lineTo(-20 * scale, 20 * scale);
        ctx.lineTo(-5 * scale, 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(5 * scale, 0);
        ctx.lineTo(25 * scale, 15 * scale);
        ctx.lineTo(20 * scale, 20 * scale);
        ctx.lineTo(5 * scale, 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Sonic effect
        drawSonicEffect(ctx, scale, design);
    } else {
        // Aurora Fighter (default)
        ctx.fillStyle = design.mainColor;
        
        // Main hull
        ctx.beginPath();
        ctx.moveTo(0, -30 * scale);
        ctx.lineTo(-20 * scale, 20 * scale);
        ctx.lineTo(20 * scale, 20 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Wings
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.moveTo(-15 * scale, 0);
        ctx.lineTo(-30 * scale, 15 * scale);
        ctx.lineTo(-10 * scale, 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(15 * scale, 0);
        ctx.lineTo(30 * scale, 15 * scale);
        ctx.lineTo(10 * scale, 15 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Cockpit
        ctx.fillStyle = design.engineColor;
        ctx.beginPath();
        ctx.moveTo(0, -25 * scale);
        ctx.lineTo(-8 * scale, -10 * scale);
        ctx.lineTo(8 * scale, -10 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Pulse effect
        drawPulseEffect(ctx, scale, design);
    }
    
    // Engine glow for all ships
    ctx.shadowColor = design.engineColor;
    ctx.shadowBlur = 15;
    ctx.fillStyle = design.engineColor;
    ctx.fillRect(-8 * scale, 20 * scale, 16 * scale, 5 * scale);
    
    ctx.restore();
}

function drawPulseEffect(ctx, scale, design) {
    const pulse = Math.sin(Date.now() / 500) * 0.5 + 0.5;
    ctx.strokeStyle = design.engineColor;
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 40 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawSonicEffect(ctx, scale, design) {
    const time = Date.now() / 100;
    ctx.strokeStyle = design.engineColor;
    ctx.lineWidth = 2 * scale;
    
    for(let i = 0; i < 2; i++) {
        const offset = Math.sin(time + i) * 3 * scale;
        ctx.beginPath();
        ctx.moveTo(-40 * scale + offset, 20 * scale);
        ctx.lineTo(-20 * scale, 0);
        ctx.lineTo(-40 * scale + offset, -20 * scale);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(40 * scale - offset, 20 * scale);
        ctx.lineTo(20 * scale, 0);
        ctx.lineTo(40 * scale - offset, -20 * scale);
        ctx.stroke();
    }
}

function drawFlameEffect(ctx, scale, design) {
    const time = Date.now() / 100;
    const gradient = ctx.createLinearGradient(0, 20 * scale, 0, 35 * scale);
    gradient.addColorStop(0, design.engineColor);
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    for(let i = 0; i < 3; i++) {
        const width = (10 + Math.sin(time + i) * 5) * scale;
        ctx.beginPath();
        ctx.moveTo(-width/2, 20 * scale);
        ctx.lineTo(width/2, 20 * scale);
        ctx.lineTo(0, 35 * scale);
        ctx.closePath();
        ctx.fill();
    }
}

function drawStealthEffect(ctx, scale, design) {
    const time = Date.now() / 1000;
    ctx.globalAlpha = 0.3 + Math.sin(time * 2) * 0.2;
    ctx.strokeStyle = design.engineColor;
    ctx.lineWidth = 1 * scale;
    
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (30 + i * 10) * scale, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
}

function drawShieldEffect(ctx, scale, design) {
    const time = Date.now() / 1000;
    ctx.strokeStyle = design.engineColor;
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = Math.sin(time) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 35 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// Update ship preview
function updateShipPreview() {
    const canvas = document.getElementById('shipPreview');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    drawPreviewStars(ctx);
    
    // Draw ship with hover effect
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2 + Math.sin(shipHoverEffect) * 10);
    
    // Draw special effect
    if(typeof drawSpecialEffect === 'function') {
        drawSpecialEffect(ctx, selectedShip, 2);
    }
    
    drawShipBase(ctx, selectedShip.design, 2);
    ctx.restore();
    
    // Draw selection particles
    drawSelectionParticles(ctx);
}

// Animation loop
function animatePreview() {
    shipHoverEffect += 0.05;
    updatePreviewStars();
    updateSelectionParticles();
    updateShipPreview();
    
    // Update stat bars with animation
    const stats = ['speed', 'damage', 'shield'];
    stats.forEach(stat => {
        const bar = document.getElementById(`${stat}Bar`);
        const targetWidth = selectedShip[stat] * 20;
        const currentWidth = parseFloat(bar.style.width) || 0;
        const newWidth = currentWidth + (targetWidth - currentWidth) * 0.1;
        bar.style.width = `${newWidth}%`;
    });
    
    animationFrame = requestAnimationFrame(animatePreview);
}

// Event listeners
function setupEventListeners() {
    document.getElementById('prevShip').addEventListener('click', () => {
        currentShipIndex = (currentShipIndex - 1 + SHIPS.length) % SHIPS.length;
        selectedShip = SHIPS[currentShipIndex];
        createSelectionParticles(200, 150, selectedShip.design.engineColor);
        updateShipDisplay();
    });

    document.getElementById('nextShip').addEventListener('click', () => {
        currentShipIndex = (currentShipIndex + 1) % SHIPS.length;
        selectedShip = SHIPS[currentShipIndex];
        createSelectionParticles(200, 150, selectedShip.design.engineColor);
        updateShipDisplay();
    });

    document.getElementById('selectButton').addEventListener('click', () => {
        // Save complete ship data
        const shipToSave = {
            ...selectedShip,
            design: {
                mainColor: selectedShip.design.mainColor,
                accentColor: selectedShip.design.accentColor,
                engineColor: selectedShip.design.engineColor,
                type: selectedShip.design.type,
                special: selectedShip.design.special
            }
        };
        localStorage.setItem('selectedShip', JSON.stringify(shipToSave));
        
        // Create selection effect before transitioning
        createSelectionParticles(200, 150, selectedShip.design.engineColor);
        setTimeout(() => {
            window.location.href = 'monster.html';
        }, 500);
    });

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'monster.html';
    });
}

// Update display
function updateShipDisplay() {
    const ship = SHIPS[currentShipIndex];
    
    // Update ship name with fade effect
    const shipName = document.getElementById('shipName');
    shipName.style.opacity = '0';
    setTimeout(() => {
        shipName.textContent = ship.name;
        shipName.style.opacity = '1';
    }, 200);
    
    // Update description with fade effect
    const shipDesc = document.getElementById('shipDescription');
    shipDesc.style.opacity = '0';
    setTimeout(() => {
        shipDesc.textContent = ship.description;
        shipDesc.style.opacity = '1';
    }, 200);
    
    updateThumbnailSelection();
}

// Update thumbnail selection
function updateThumbnailSelection() {
    const thumbnails = document.querySelectorAll('.ship-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentShipIndex);
        if(index === currentShipIndex) {
            createSelectionParticles(
                thumb.offsetLeft + thumb.width/2,
                thumb.offsetTop + thumb.height/2,
                SHIPS[index].design.engineColor
            );
        }
    });
}

// Select ship by index
function selectShip(index) {
    currentShipIndex = index;
    selectedShip = SHIPS[currentShipIndex];
    console.log('Selected ship:', selectedShip); // Debug log
    updateShipDisplay();
    updateThumbnailSelection();
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', init); 