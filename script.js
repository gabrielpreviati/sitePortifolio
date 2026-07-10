// ==========================================
// 1. MALHA DE FUNDO INTERATIVA (CANVAS MESH)
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let spacing = 55; // Distância entre as linhas da malha
let numCols = Math.ceil(width / spacing) + 1;
let numRows = Math.ceil(height / spacing) + 1;
let points = [];

class MeshPoint {
    constructor(x, y) {
        this.ox = x; // Posição de origem X
        this.oy = y; // Posição de origem Y
        this.x = x;
        this.y = y;
    }

    update(mouse) {
        let dx = mouse.x - this.ox;
        let dy = mouse.y - this.oy;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        let radius = 180; // Raio de influência do mouse
        
        if (dist < radius) {
            // Força de repulsão baseada na proximidade
            let force = (radius - dist) / radius;
            let angle = Math.atan2(dy, dx);
            
            // Empurra o ponto para longe do cursor
            let targetX = this.ox - Math.cos(angle) * force * 45;
            let targetY = this.oy - Math.sin(angle) * force * 45;
            
            this.x += (targetX - this.x) * 0.15;
            this.y += (targetY - this.y) * 0.15;
        } else {
            // Retorna suavemente para a posição original
            this.x += (this.ox - this.x) * 0.08;
            this.y += (this.oy - this.y) * 0.08;
        }
    }
}

function initMesh() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    numCols = Math.ceil(width / spacing) + 1;
    numRows = Math.ceil(height / spacing) + 1;
    
    points = [];
    for (let r = 0; r < numRows; r++) {
        points[r] = [];
        for (let c = 0; c < numCols; c++) {
            points[r][c] = new MeshPoint(c * spacing, r * spacing);
        }
    }
}

let mouse = { x: -1000, y: -1000 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

window.addEventListener('resize', initMesh);

function animateMesh() {
    ctx.clearRect(0, 0, width, height);
    
    // Atualiza as coordenadas física de todos os pontos
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            points[r][c].update(mouse);
        }
    }
    
    // Desenha as conexões da malha
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            let current = points[r][c];
            
            // Calcula proximidade do mouse para acender as linhas próximas (Efeito Brilho)
            let dmx = mouse.x - current.x;
            let dmy = mouse.y - current.y;
            let mDist = Math.sqrt(dmx * dmx + dmy * dmy);
            
            if (mDist < 220) {
                let alpha = 0.28 * (1 - mDist / 220);
                ctx.strokeStyle = `rgba(0, 255, 204, ${alpha + 0.03})`;
                ctx.lineWidth = 1.2;
            } else {
                ctx.strokeStyle = 'rgba(0, 255, 204, 0.035)';
                ctx.lineWidth = 1;
            }
            
            // Linha Horizontal
            if (c < numCols - 1) {
                ctx.beginPath();
                ctx.moveTo(current.x, current.y);
                ctx.lineTo(points[r][c + 1].x, points[r][c + 1].y);
                ctx.stroke();
            }
            
            // Linha Vertical
            if (r < numRows - 1) {
                ctx.beginPath();
                ctx.moveTo(current.x, current.y);
                ctx.lineTo(points[r + 1][c].x, points[r + 1][c].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateMesh);
}

// Inicializa a malha
initMesh();
animateMesh();


// ==========================================
// 2. LÓGICA DO MENU HAMBÚRGUER & NAVEGAÇÃO
// ==========================================
const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul li a');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    if (nav.classList.contains('active')) {
        menuBtn.innerHTML = '&times;'; // Altera ícone para 'X'
    } else {
        menuBtn.innerHTML = '&#9776;'; // Retorna para Hambúrguer
    }
});

// Fecha o menu ao escolher uma seção (Mobile) e aplica classe Active
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        if (window.innerWidth <= 768) {
            nav.classList.remove('active');
            menuBtn.innerHTML = '&#9776;';
        }
    });
});


// ==========================================
// 3. CONTROLE DE MODAIS DOS PROJETOS
// ==========================================
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

const botoesFechar = document.querySelectorAll('.fechar-modal');
botoesFechar.forEach(botao => {
    botao.addEventListener('click', function() {
        const modal = botao.closest('.modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

window.addEventListener('click', function(event) {
    const modalsAbertos = document.querySelectorAll('.modal.show');
    modalsAbertos.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});


// ==========================================
// 4. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
// ==========================================
const form = document.getElementById('form-contato');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (nome === "" || mensagem === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    form.submit();
    alert("Formulário validado com sucesso! Redirecionando...");
    form.reset();
});