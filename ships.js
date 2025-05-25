// Available ships configuration
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

// Initialize ship selector
function initShipSelector() {
    // Try to load saved ship from localStorage
    const savedShipData = localStorage.getItem('selectedShip');
    if (savedShipData) {
        try {
            const savedShip = JSON.parse(savedShipData);
            // Find the matching ship in SHIPS array
            const shipIndex = SHIPS.findIndex(ship => ship.id === savedShip.id);
            if (shipIndex !== -1) {
                currentShipIndex = shipIndex;
                selectedShip = SHIPS[shipIndex];
            }
        } catch (e) {
            console.error('Error loading saved ship:', e);
        }
    }

    const customizeButton = document.getElementById('customizeButton');
    const shipSelector = document.getElementById('shipSelector');
    const prevButton = document.getElementById('prevShip');
    const nextButton = document.getElementById('nextShip');

    if (customizeButton && shipSelector) {
        customizeButton.addEventListener('click', () => {
            shipSelector.style.display = shipSelector.style.display === 'none' ? 'flex' : 'none';
            updateShipDisplay();
        });
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            currentShipIndex = (currentShipIndex - 1 + SHIPS.length) % SHIPS.length;
            selectedShip = SHIPS[currentShipIndex];
            updateShipDisplay();
            saveSelectedShip();
        });

        nextButton.addEventListener('click', () => {
            currentShipIndex = (currentShipIndex + 1) % SHIPS.length;
            selectedShip = SHIPS[currentShipIndex];
            updateShipDisplay();
            saveSelectedShip();
        });
    }
}

// Save selected ship to localStorage
function saveSelectedShip() {
    try {
        localStorage.setItem('selectedShip', JSON.stringify(selectedShip));
        console.log('Ship saved:', selectedShip);
    } catch (e) {
        console.error('Error saving ship:', e);
    }
}

// Update ship display
function updateShipDisplay() {
    const ship = SHIPS[currentShipIndex];
    const preview = document.getElementById('shipPreview');
    const shipName = document.getElementById('shipName');
    const speedStat = document.getElementById('speedStat');
    const damageStat = document.getElementById('damageStat');
    const shieldStat = document.getElementById('shieldStat');

    if (shipName && speedStat && damageStat && shieldStat) {
        shipName.textContent = ship.name;
        speedStat.textContent = '★'.repeat(ship.speed);
        damageStat.textContent = '★'.repeat(ship.damage);
        shieldStat.textContent = '★'.repeat(ship.shield);
    }

    if (preview) {
        const ctx = preview.getContext('2d');
        preview.width = 200;
        preview.height = 150;
        
        ctx.save();
        ctx.translate(preview.width/2, preview.height/2);
        drawShipBase(ctx, ship.design, 2);
        ctx.restore();
    }
}

// Draw ship base function
function drawShipBase(ctx, design, scale = 1) {
    ctx.save();
    
    switch(design.type) {
        case 'dragon':
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
            break;
            
        case 'sonic':
            // Sonic Interceptor design
            ctx.fillStyle = design.mainColor;
            
            // Sleek body
            ctx.beginPath();
            ctx.moveTo(0, -35 * scale);
            ctx.quadraticCurveTo(-15 * scale, -10 * scale, -10 * scale, 20 * scale);
            ctx.lineTo(10 * scale, 20 * scale);
            ctx.quadraticCurveTo(15 * scale, -10 * scale, 0, -35 * scale);
            ctx.fill();
            
            // Accent stripes
            ctx.strokeStyle = design.accentColor;
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
            break;
            
        default: // Aurora Fighter
            // Draw ship base
            ctx.fillStyle = design.mainColor;
            ctx.beginPath();
            ctx.moveTo(0, -30 * scale);
            ctx.lineTo(-20 * scale, 5 * scale);
            ctx.lineTo(20 * scale, 5 * scale);
            ctx.closePath();
            ctx.fill();
            
            // Draw ship details
            ctx.fillStyle = design.accentColor;
            ctx.beginPath();
            ctx.moveTo(0, -25 * scale);
            ctx.lineTo(-8 * scale, -10 * scale);
            ctx.lineTo(8 * scale, -10 * scale);
            ctx.closePath();
            ctx.fill();
    }
    
    // Engine glow (common for all ships)
    ctx.fillStyle = design.engineColor;
    ctx.shadowColor = design.engineColor;
    ctx.shadowBlur = 15 * scale;
    ctx.fillRect(-10 * scale, 8 * scale, 4 * scale, 8 * scale);
    ctx.fillRect(6 * scale, 8 * scale, 4 * scale, 8 * scale);
    
    ctx.restore();
}

// Apply selected ship properties to player
function applyShipToPlayer(player) {
    const ship = selectedShip || SHIPS[0];
    
    player.speed = ship.speed;
    player.damage = ship.damage;
    player.maxShieldTime = ship.shield * 100;
    player.design = { ...ship.design };
    
    console.log('Applied ship to player:', ship);
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initShipSelector);

// Export necessary functions and variables
window.SHIPS = SHIPS;
window.selectedShip = selectedShip;
window.applyShipToPlayer = applyShipToPlayer;
window.saveSelectedShip = saveSelectedShip;
window.drawShipBase = drawShipBase; 