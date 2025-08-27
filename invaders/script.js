const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('scoreEl');
const startButton = document.getElementById('startButton');
const startScreen = document.querySelector('.start-screen');

// --- Game Settings ---
canvas.width = 1024;
canvas.height = 576;

class Player {
    constructor() {
        this.width = 50;
        this.height = 20;
        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 20
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.speed = 8;
        this.color = '#00ffff'; // Neon Cyan
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Reset shadow for other elements
        ctx.shadowBlur = 0;
    }

    update() {
        this.position.x += this.velocity.x;

        // Prevent player from going off-screen
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width;
        }

        this.draw();
    }
}

// --- Game State ---
let player = new Player();
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    space: { pressed: false }
};

let game = {
    active: false,
    score: 0
};

// --- Game Loop ---
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (game.active) {
        player.update();

        // Player movement
        if (keys.a.pressed) {
            player.velocity.x = -player.speed;
        } else if (keys.d.pressed) {
            player.velocity.x = player.speed;
        } else {
            player.velocity.x = 0;
        }
    }
}

// --- Event Listeners ---
window.addEventListener('keydown', ({ key }) => {
    if (!game.active) return;

    switch (key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
            keys.a.pressed = true;
            break;
        case 'd':
        case 'arrowright':
            keys.d.pressed = true;
            break;
        case ' ': // Spacebar
            keys.space.pressed = true;
            // TODO: Fire projectile
            break;
    }
});

window.addEventListener('keyup', ({ key }) => {
    if (!game.active) return;

    switch (key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
            keys.a.pressed = false;
            break;
        case 'd':
        case 'arrowright':
            keys.d.pressed = false;
            break;
        case ' ': // Spacebar
            keys.space.pressed = false;
            break;
    }
});

startButton.addEventListener('click', () => {
    game.active = true;
    startScreen.classList.add('hidden');
    player = new Player(); // Reset player
    // TODO: Reset other game elements
});

// --- Start Animation ---
animate();