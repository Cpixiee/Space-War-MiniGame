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
let isMobile = window.innerWidth <= 768;

// Initialize
function init() {
    // Check if we're coming back from game
    const savedShipData = localStorage.getItem('selectedShip');
    if (savedShipData) {
        try {
            const savedShip = JSON.parse(savedShipData);
            const shipIndex = SHIPS.findIndex(ship => ship.id === savedShip.id);
            if (shipIndex !== -1) {
                currentShipIndex = shipIndex;
                selectedShip = SHIPS[shipIndex];
            }
        } catch (e) {
            console.error('Error loading saved ship:', e);
        }
    }

    createThumbnails();
    updateShipDisplay();
    setupEventListeners();
    animateStars();
    
    // Handle resize events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
}

function handleResize() {
    isMobile = window.innerWidth <= 768;
    
    // Update canvas sizes
    const canvas = document.getElementById('shipPreview');
    if (canvas) {
        if (isMobile) {
            canvas.width = Math.min(300, window.innerWidth - 40);
            canvas.height = Math.min(200, window.innerHeight - 200);
        } else {
            canvas.width = 400;
            canvas.height = 300;
        }
        updateShipPreview();
    }

    // Update thumbnails
    const thumbnails = document.querySelectorAll('.ship-thumbnail');
    thumbnails.forEach(thumbnail => {
        if (isMobile) {
            thumbnail.width = 60;
            thumbnail.height = 45;
        } else {
            thumbnail.width = 80;
            thumbnail.height = 60;
        }
        drawShipThumbnail(thumbnail, SHIPS[currentShipIndex].design);
    });
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

// Update display
function updateShipDisplay() {
    const ship = SHIPS[currentShipIndex];
    
    // Update stats
    document.getElementById('shipName').textContent = ship.name;
    document.getElementById('shipDescription').textContent = ship.description;
    
    // Update stat bars and values
    updateStat('speed', ship.speed);
    updateStat('damage', ship.damage);
    updateStat('shield', ship.shield);
    
    // Update preview
    updateShipPreview();
    updateThumbnailSelection();
}

function updateStat(stat, value) {
    const bar = document.getElementById(`${stat}Bar`);
    const valueEl = document.getElementById(`${stat}Value`);
    bar.style.width = `${value * 20}%`;
    valueEl.textContent = value;
}

function updateShipPreview() {
    const canvas = document.getElementById('shipPreview');
    const ctx = canvas.getContext('2d');
    
    // Clear previous animation frame if exists
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    const scale = isMobile ? 1.5 : 2;
    drawShipBase(ctx, SHIPS[currentShipIndex].design, scale);
    ctx.restore();
    
    // Start animation loop
        animate();
}

function updateThumbnailSelection() {
    const thumbnails = document.querySelectorAll('.ship-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentShipIndex);
    });
}

// Animation loop
function animate() {
    const canvas = document.getElementById('shipPreview');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    drawShipBase(ctx, SHIPS[currentShipIndex].design, 2);
    ctx.restore();
    
    animationFrame = requestAnimationFrame(animate);
}

// Event listeners
function setupEventListeners() {
    document.getElementById('prevShip').addEventListener('click', () => {
        currentShipIndex = (currentShipIndex - 1 + SHIPS.length) % SHIPS.length;
        selectedShip = SHIPS[currentShipIndex];
        updateShipDisplay();
    });

    document.getElementById('nextShip').addEventListener('click', () => {
        currentShipIndex = (currentShipIndex + 1) % SHIPS.length;
        selectedShip = SHIPS[currentShipIndex];
        updateShipDisplay();
    });

    document.getElementById('selectButton').addEventListener('click', () => {
        localStorage.setItem('selectedShip', JSON.stringify(selectedShip));
        window.location.href = 'index.html';
    });

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Add touch events for mobile
    if ('ontouchstart' in window) {
        setupTouchEvents();
    }
}

// Touch event handlers
function setupTouchEvents() {
    const shipDisplay = document.querySelector('.ship-display');
    let startX = 0;
    let isDragging = false;

    shipDisplay.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    shipDisplay.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) { // Threshold for swipe
            if (diff > 0) {
                // Swipe left
                currentShipIndex = (currentShipIndex + 1) % SHIPS.length;
            } else {
                // Swipe right
                currentShipIndex = (currentShipIndex - 1 + SHIPS.length) % SHIPS.length;
            }
            selectedShip = SHIPS[currentShipIndex];
            updateShipDisplay();
            startX = currentX;
        }
    });

    shipDisplay.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Star animation
function animateStars() {
    const stars1 = document.getElementById('stars1');
    const stars2 = document.getElementById('stars2');
    const stars3 = document.getElementById('stars3');

    if (stars1 && stars2 && stars3) {
        // Small stars
        let starsShadow1 = '';
        for (let i = 0; i < 700; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            starsShadow1 += `${x}vw ${y}vh 1px #fff${i < 699 ? ',' : ''}`;
        }
        stars1.style.boxShadow = starsShadow1;

        // Medium stars
        let starsShadow2 = '';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            starsShadow2 += `${x}vw ${y}vh 2px #fff${i < 199 ? ',' : ''}`;
        }
        stars2.style.boxShadow = starsShadow2;

        // Large stars
        let starsShadow3 = '';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            starsShadow3 += `${x}vw ${y}vh 3px #fff${i < 99 ? ',' : ''}`;
        }
        stars3.style.boxShadow = starsShadow3;
    }
}

// Select ship by index
function selectShip(index) {
    currentShipIndex = index;
    selectedShip = SHIPS[currentShipIndex];
    updateShipDisplay();
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', init); 