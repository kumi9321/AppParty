const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('scoreEl');
const finalScoreEl = document.getElementById('finalScoreEl');
const clearScoreEl = document.getElementById('clearScoreEl');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const playAgainButton = document.getElementById('playAgainButton');
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const gameClearScreen = document.querySelector('.game-clear-screen');

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
        this.velocity = { x: 0, y: 0 };
        this.speed = 8;
        this.color = '#00ffff';
        this.opacity = 1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
    update() {
        if (this.opacity === 0) return;
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
        this.color = '#00ff00';
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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
        this.velocity = { x: 3, y: 0 };
        this.invaders = [];
        const columns = Math.floor(Math.random() * 5 + 5);
        const rows = Math.floor(Math.random() * 3 + 2);
        this.width = columns * 50;
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
            this.velocity.y = 30;
        }
    }
}

class Particle {
    constructor({ position, velocity, radius, color }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fade = 0.01;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.opacity -= this.fade;
        this.draw();
    }
}

let player, projectiles, grids, invaderProjectiles, particles, keys, game, frames;

function init() {
    player = new Player();
    projectiles = [];
    grids = [new Grid()];
    invaderProjectiles = [];
    particles = [];
    keys = { a: { pressed: false }, d: { pressed: false }, space: { pressed: false } };
    game = { active: false, score: 0 };
    frames = 0;
    scoreEl.innerText = 0;
}

function createParticles(object, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({            position: { x: object.position.x + object.width / 2, y: object.position.y + object.height / 2 },            velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },            radius: Math.random() * 3,            color: color || '#00ff00'        }));
    }
}

function endGame() {
    game.active = false;
    finalScoreEl.innerText = game.score;
    setTimeout(() => {
        player.opacity = 0;
        gameOverScreen.classList.remove('hidden');
    }, 500);
    createParticles(player, player.color);
}

function gameClear() {
    game.active = false;
    clearScoreEl.innerText = game.score;
    setTimeout(() => {
        gameClearScreen.classList.remove('hidden');
    }, 500);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!game.active) return;

    player.update();

    particles.forEach((p, i) => {
        if (p.opacity <= 0) setTimeout(() => particles.splice(i, 1), 0);
        else p.update();
    });

    invaderProjectiles.forEach((p, i) => {
        if (p.position.y + p.height > canvas.height) {
            setTimeout(() => invaderProjectiles.splice(i, 1), 0);
        } else {
            p.update();
        }

        if (p.position.y + p.height >= player.position.y && p.position.y <= player.position.y + player.height && p.position.x + p.width >= player.position.x && p.position.x <= player.position.x + player.width) {
            setTimeout(() => {
                invaderProjectiles.splice(i, 1);
                endGame();
            }, 0);
        }
    });

    projectiles.forEach((p, i) => {
        if (p.position.y + p.height < 0) {
            setTimeout(() => projectiles.splice(i, 1), 0);
        } else {
            p.update();
        }
    });

    grids.forEach((grid, gridIndex) => {
        grid.update();
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            const randomInvader = grid.invaders[Math.floor(Math.random() * grid.invaders.length)];
            invaderProjectiles.push(new Projectile({                position: { x: randomInvader.position.x + randomInvader.width / 2, y: randomInvader.position.y + randomInvader.height },                velocity: { x: 0, y: 5 },                color: '#ff0000'            }));
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y <= invader.position.y + invader.height && projectile.position.y + projectile.height >= invader.position.y && projectile.position.x + projectile.width >= invader.position.x && projectile.position.x <= invader.position.x + invader.width) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(inv => inv === invader);
                        if (invaderFound) {
                            createParticles(invader, invader.color);
                            game.score += 100;
                            scoreEl.innerText = game.score;
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if (grid.invaders.length === 0) {
                                grids.splice(gridIndex, 1);
                                if (grids.length === 0) {
                                    gameClear();
                                }
                            }
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

function startGame() {
    init();
    game.active = true;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameClearScreen.classList.add('hidden');
}

window.addEventListener('keydown', ({ key }) => {
    if (!game.active) return;
    switch (key.toLowerCase()) {
        case 'a': case 'arrowleft': keys.a.pressed = true; break;
        case 'd': case 'arrowright': keys.d.pressed = true; break;
        case ' ': // Spacebar
            if (!keys.space.pressed) {
                projectiles.push(new Projectile({ 
                    position: { x: player.position.x + player.width / 2 - 2.5, y: player.position.y }, 
                    velocity: { x: 0, y: -10 } 
                }));
            }
            keys.space.pressed = true;
            break;
    }
});

window.addEventListener('keyup', ({ key }) => {
    switch (key.toLowerCase()) {
        case 'a': case 'arrowleft': keys.a.pressed = false; break;
        case 'd': case 'arrowright': keys.d.pressed = false; break;
        case ' ': keys.space.pressed = false; break;
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

init();
animate();
