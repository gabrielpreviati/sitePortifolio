// Pegando o formulário
const form = document.getElementById('form-contato');

// Evento ao enviar o formulário
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio real

    // Pegando valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    // Validação simples
    if (nome === "") {
        alert("Por favor, preencha o campo Nome.");
        return;
    }

    if (!validarEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    if (mensagem === "") {
        alert("Por favor, escreva sua mensagem.");
        return;
    }

    // Se passar na validação
    alert("Formulário enviado com sucesso!");
    form.reset(); // Limpa os campos
});

// Função para validar e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Efeito no botão
const botao = document.querySelector('button');
botao.addEventListener('click', () => {
    botao.style.transform = 'scale(0.95)';
    setTimeout(() => {
        botao.style.transform = 'scale(1)';
    }, 150);
});

// Função para abrir o modal
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Fechar o modal ao clicar no botão 'X'
const botoesFechar = document.querySelectorAll('.fechar-modal');

botoesFechar.forEach(botao => {
    botao.addEventListener('click', function(event) {
        const modal = botao.closest('.modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Fechar o modal se o usuário clicar no fundo escuro
window.addEventListener('click', function(event) {
    const modalsAbertos = document.querySelectorAll('.modal.show');
    modalsAbertos.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});