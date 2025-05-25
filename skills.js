// Skill cooldowns and states
const skills = {
    rapidFire: {
        active: false,
        cooldown: 0,
        maxCooldown: 600,
        duration: 180
    },
    shield: {
        active: false,
        cooldown: 0,
        maxCooldown: 900,
        duration: 300
    },
    laserBeam: {
        active: false,
        cooldown: 0,
        maxCooldown: 1200,
        duration: 120
    }
};

// Update skill cooldowns
function updateSkills() {
    // Rapid Fire
    if(skills.rapidFire.cooldown > 0) {
        skills.rapidFire.cooldown--;
        document.getElementById('rapidfire-cd').textContent = Math.ceil(skills.rapidFire.cooldown / 60) + 's';
    } else if(!skills.rapidFire.active) {
        document.getElementById('rapidfire-cd').textContent = 'Ready';
    }
    
    // Shield
    if(skills.shield.cooldown > 0) {
        skills.shield.cooldown--;
        document.getElementById('shield-cd').textContent = Math.ceil(skills.shield.cooldown / 60) + 's';
    } else if(!skills.shield.active) {
        document.getElementById('shield-cd').textContent = 'Ready';
    }
    
    // Laser Beam
    if(skills.laserBeam.cooldown > 0) {
        skills.laserBeam.cooldown--;
        document.getElementById('laser-cd').textContent = Math.ceil(skills.laserBeam.cooldown / 60) + 's';
    } else if(!skills.laserBeam.active) {
        document.getElementById('laser-cd').textContent = 'Ready';
    }
}

// Activate Rapid Fire
function activateRapidFire() {
    if(skills.rapidFire.cooldown === 0 && !skills.rapidFire.active) {
        skills.rapidFire.active = true;
        setTimeout(() => {
            skills.rapidFire.active = false;
            skills.rapidFire.cooldown = skills.rapidFire.maxCooldown;
        }, skills.rapidFire.duration * (1000/60));
        
        // Visual feedback
        document.querySelector('.skill-item:nth-child(1)').classList.add('activated');
        setTimeout(() => {
            document.querySelector('.skill-item:nth-child(1)').classList.remove('activated');
        }, 300);
    }
}

// Activate Shield
function activateShield() {
    if(skills.shield.cooldown === 0 && !skills.shield.active) {
        skills.shield.active = true;
        player.shield = true;
        player.shieldTime = skills.shield.duration;
        
        setTimeout(() => {
            skills.shield.active = false;
            skills.shield.cooldown = skills.shield.maxCooldown;
            stopSound(shieldSound);
        }, skills.shield.duration * (1000/60));
        
        // Visual feedback
        document.querySelector('.skill-item:nth-child(2)').classList.add('activated');
        setTimeout(() => {
            document.querySelector('.skill-item:nth-child(2)').classList.remove('activated');
        }, 300);
    }
}

// Activate Laser Beam
function activateLaserBeam() {
    if(skills.laserBeam.cooldown === 0 && !skills.laserBeam.active) {
        skills.laserBeam.active = true;
        
        // Create powerful laser beam
        const laserBeam = {
            x: player.x + player.width / 2,
            y: 0,
            width: 8,
            height: player.y,
            speed: 0,
            color: '#ff00ff',
            damage: 5,
            isLaser: true,
            followPlayer: true
        };
        bullets.push(laserBeam);
        
        // Update laser position in game loop
        const updateLaser = () => {
            if(laserBeam && laserBeam.followPlayer) {
                laserBeam.x = player.x + player.width / 2;
                laserBeam.height = player.y;
            }
        };
        
        // Start updating laser position
        const laserInterval = setInterval(updateLaser, 1000/60);
        
        setTimeout(() => {
            skills.laserBeam.active = false;
            skills.laserBeam.cooldown = skills.laserBeam.maxCooldown;
            // Remove laser beam and stop updating
            bullets = bullets.filter(bullet => !bullet.isLaser);
            clearInterval(laserInterval);
            stopSound(laserSound);
        }, skills.laserBeam.duration * (1000/60));
        
        // Visual feedback
        document.querySelector('.skill-item:nth-child(3)').classList.add('activated');
        setTimeout(() => {
            document.querySelector('.skill-item:nth-child(3)').classList.remove('activated');
        }, 300);
    }
}

// Reset all skills
function resetAllSkills() {
    for(let skill in skills) {
        skills[skill].active = false;
        skills[skill].cooldown = 0;
    }
    
    updateSkillDisplay();
}

// Update skill display
function updateSkillDisplay() {
    document.getElementById('rapidfire-cd').textContent = 'Ready';
    document.getElementById('shield-cd').textContent = 'Ready';
    document.getElementById('laser-cd').textContent = 'Ready';
} 