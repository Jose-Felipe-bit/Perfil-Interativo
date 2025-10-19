// Movimentação do card
const card = document.getElementById('profileCard');
let isDragging = false, offsetX = 0, offsetY = 0;

card.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - card.getBoundingClientRect().left;
    offsetY = e.clientY - card.getBoundingClientRect().top;
    card.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => { 
    isDragging = false; 
    card.style.cursor = 'grab'; 
});

document.addEventListener('mousemove', e => {
    if (isDragging) {
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;
        card.style.left = left + 'px';
        card.style.top = top + 'px';
    }
});

// Centralizar card
function centerCard() { 
    card.style.left = `${(window.innerWidth - card.offsetWidth)/2}px`;
    card.style.top = `${(window.innerHeight - card.offsetHeight)/2}px`;
}
window.addEventListener('resize', centerCard);
window.addEventListener('load', () => { centerCard(); card.classList.add('show'); });

// Inputs L e A
const inputWidth = document.getElementById('inputWidth');
const inputHeight = document.getElementById('inputHeight');
const applySizeBtn = document.getElementById('applySizeBtn');

applySizeBtn.addEventListener('click', () => {
    let newWidth = parseInt(inputWidth.value);
    let newHeight = parseInt(inputHeight.value);
    if (isNaN(newWidth) || newWidth < 150) newWidth = 150;
    if (newWidth > 800) newWidth = 800;
    if (isNaN(newHeight) || newHeight < 150) newHeight = 150;
    if (newHeight > 800) newHeight = 800;
    card.style.width = newWidth + 'px';
    card.style.height = newHeight + 'px';
    centerCard();
});

// Botões
const presentBtn = document.getElementById('presentBtn');
const infoBtn = document.getElementById('infoBtn');
const descEl = document.getElementById('profileDesc');
const linksEl = document.getElementById('social-links');

presentBtn.addEventListener('click', () => {
    descEl.style.display = 'none';
    linksEl.style.display = 'flex';
    linksEl.classList.add('show');
    centerCard();
    card.classList.add('pulse', 'sweep');
});

infoBtn.addEventListener('click', () => {
    linksEl.classList.remove('show');
    linksEl.style.display = 'none';
    descEl.style.display = 'block';
    centerCard();
    card.classList.add('pulse', 'sweep');
});

// Partículas brilhosas
const canvas = document.getElementById('energyCanvas');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, particles = [], particleAnimId = null;

function resizeCanvas() { 
    width = canvas.width = innerWidth; 
    height = canvas.height = innerHeight; 
}
window.addEventListener('resize', resizeCanvas); 
resizeCanvas();

function spawnParticle(x, y, spread = 120, hue = 180) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 2.6;
    particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 80,
        size: 2 + Math.random() * 6,
        hue: hue + (Math.random() * 40 - 20),
        alpha: 0.9
    });
}

function particleLoop() {
    particleAnimId = requestAnimationFrame(particleLoop);
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.life--;
        p.alpha *= 0.998;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        g.addColorStop(0, `hsla(${p.hue},100%,60%,${p.alpha})`);
        g.addColorStop(0.3, `hsla(${p.hue},80%,45%,${p.alpha * 0.35})`);
        g.addColorStop(1, `rgba(0,0,0,0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${p.hue},100%,60%,${Math.min(1, p.alpha * 1.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0 || p.alpha < 0.02 || p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
            particles.splice(i, 1);
        }
    }
}

window.addEventListener('click', e => {
    for (let i = 0; i < 28; i++) 
        spawnParticle(e.clientX + (Math.random() * 24 - 12), e.clientY + (Math.random() * 24 - 12), 60, 200 + Math.random() * 40 - 20);
});

particleLoop();

// Fundo animado
let bgX = 50, bgY = 50, dirX = 0.02, dirY = 0.01;
function moveBackground() {
    bgX += dirX;
    bgY += dirY;
    if (bgX > 52 || bgX < 48) dirX *= -1;
    if (bgY > 52 || bgY < 48) dirY *= -1;
    document.body.style.backgroundPosition = `${bgX}% ${bgY}%`;
    requestAnimationFrame(moveBackground);
}
moveBackground();

let bgSize = 105, zoomDir = 0.02;
function zoomBackground() {
    bgSize += zoomDir;
    if (bgSize > 107 || bgSize < 103) zoomDir *= -1;
    document.body.style.backgroundSize = `${bgSize}%`;
    requestAnimationFrame(zoomBackground);
}
zoomBackground();
