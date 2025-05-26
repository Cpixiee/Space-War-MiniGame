// Mobile Controls Handler
window.mobileControlsHandler = {
    init() {
        // Only initialize if on mobile device
        if (this.isMobileDevice()) {
            this.setupControls();
            this.showMobileControls();
        }
    },

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
    },

    showMobileControls() {
        const mobileControlsElement = document.querySelector('.mobile-controls');
        if (mobileControlsElement) {
            mobileControlsElement.style.display = 'block';
        }
    },

    setupControls() {
        // D-Pad Controls
        this.setupDPadButton('mobileUp', 'KeyW');
        this.setupDPadButton('mobileDown', 'KeyS');
        this.setupDPadButton('mobileLeft', 'KeyA');
        this.setupDPadButton('mobileRight', 'KeyD');

        // Action Buttons
        this.setupActionButton('mobileShoot', 'Space');
        this.setupActionButton('mobileQ', 'KeyQ');
        this.setupActionButton('mobileE', 'KeyE');
        this.setupActionButton('mobileF', 'KeyF');
    },

    setupDPadButton(buttonId, keyCode) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        // Touch events for d-pad
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            window.keys[keyCode] = true;
            button.classList.add('active');
        });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            window.keys[keyCode] = false;
            button.classList.remove('active');
        });

        // Mouse events for testing on desktop
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            window.keys[keyCode] = true;
            button.classList.add('active');
        });

        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            window.keys[keyCode] = false;
            button.classList.remove('active');
        });

        // Prevent context menu on long press
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    },

    setupActionButton(buttonId, keyCode) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        // Touch events for action buttons
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (keyCode === 'Space') {
                window.shoot();
            } else {
                window.keys[keyCode] = true;
            }
            button.classList.add('active');
        });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (keyCode !== 'Space') {
                window.keys[keyCode] = false;
            }
            button.classList.remove('active');
        });

        // Mouse events for testing
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (keyCode === 'Space') {
                window.shoot();
            } else {
                window.keys[keyCode] = true;
            }
            button.classList.add('active');
        });

        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (keyCode !== 'Space') {
                window.keys[keyCode] = false;
            }
            button.classList.remove('active');
        });

        // Prevent context menu
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
};

// Initialize mobile controls when game starts
document.getElementById('playButton').addEventListener('click', () => {
    window.mobileControlsHandler.init();
}); 