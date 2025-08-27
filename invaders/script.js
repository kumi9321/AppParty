const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('scoreEl');
const startButton = document.getElementById('startButton');
const startScreen = document.querySelector('.start-screen');

// --- Game Settings ---
canvas.width = 1024;
canvas.height = 576;

// --- Classes ---
class Player {
    constructor() {
        this.width = 50;
        this.height = 20;
        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 20
        };
        this.velocity = { x: 0, y: 0 };
        this.speed = 8;
        this.color = '#00ffff'; // Neon Cyan
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.position.x += this.velocity.x;
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width;
        this.draw();
    }
}

class Projectile {
    constructor({ position, velocity, color = '#ff00ff' }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 5;
        this.height = 10;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
}

class Invader {
    constructor({ position }) {
        this.width = 40;
        this.height = 30;
        this.position = {
            x: position.x,
            y: position.y
        };
        this.color = '#00ff00'; // Neon Lime
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update({ velocity }) {
        this.position.x += velocity.x;
        this.position.y += velocity.y;
        this.draw();
    }
}

class Grid {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 4, y: 0 };
        this.invaders = [];

        const columns = Math.floor(Math.random() * 5 + 5); // 5 to 10 columns
        const rows = Math.floor(Math.random() * 3 + 2);    // 2 to 4 rows
        this.width = columns * 50; // 50 = invader width + gap

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({ position: { x: x * 50, y: y * 40 } }));
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30; // Move down
        }
    }
}

// --- Game State ---
let player;
let projectiles;
let grids;
let keys;
let game;

function init() {
    player = new Player();
    projectiles = [];
    grids = [new Grid()];
    keys = { a: { pressed: false }, d: { pressed: false }, space: { pressed: false } };
    game = { active: true, score: 0 };
    scoreEl.innerText = 0;
}

// --- Game Loop ---
let frames = 0;
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!game.active) return;

    player.update();

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.height < 0) {
            setTimeout(() => projectiles.splice(index, 1), 0);
        } else {
            projectile.update();
        }
    });

    grids.forEach((grid, gridIndex) => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });

            // Projectile hits invader
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.width >= invader.position.x &&
                    projectile.position.x <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.height >= invader.position.y
                ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(inv => inv === invader);
                        const projectileFound = projectiles.find(proj => proj === projectile);

                        if (invaderFound && projectileFound) {
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);
                            game.score += 100;
                            scoreEl.innerText = game.score;
                        }
                    }, 0);
                }
            });
        });
    });

    if (keys.a.pressed) player.velocity.x = -player.speed;
    else if (keys.d.pressed) player.velocity.x = player.speed;
    else player.velocity.x = 0;

    frames++;
}

// --- Event Listeners ---
window.addEventListener('keydown', ({ key }) => {
    if (!game.active) return;
    switch (key.toLowerCase()) {
        case 'a': case 'arrowleft': keys.a.pressed = true; break;
        case 'd': case 'arrowright': keys.d.pressed = true; break;
        case ' ': 
            if (!keys.space.pressed) {
                projectiles.push(new Projectile({
                    position: { x: player.position.x + player.width / 2 - 2.5, y: player.position.y },
                    velocity: { x: 0, y: -10 }
                }));
                keys.space.pressed = true;
            }
            break;
    }
});

window.addEventListener('keyup', ({ key }) => {
    if (!game.active) return;
    switch (key.toLowerCase()) {
        case 'a': case 'arrowleft': keys.a.pressed = false; break;
        case 'd': case 'arrowright': keys.d.pressed = false; break;
        case ' ': keys.space.pressed = false; break;
    }
});

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    init();
    animate();
});

// Initial call to set up the start screen
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
