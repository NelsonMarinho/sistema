// Função para cadastrar um novo usuário no servidor
function registerUser(username, password) {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const authMessage = document.getElementById('authMessage');
            authMessage.textContent = 'Cadastro realizado com sucesso!';
            authMessage.classList.remove('alert-danger');
            authMessage.classList.add('alert-success');
            authMessage.style.display = 'block';
            setTimeout(() => {
                document.getElementById('toggleForm').click();
            }, 2000);
        } else {
            const authMessage = document.getElementById('authMessage');
            authMessage.textContent = 'Erro ao realizar cadastro: ' + data.message;
            authMessage.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

document.getElementById('toggleForm').addEventListener('click', function(event) {
    event.preventDefault();
    const formTitle = document.getElementById('formTitle');
    const authButton = document.getElementById('authButton');
    const toggleForm = document.getElementById('toggleForm');
    const authMessage = document.getElementById('authMessage');

    if (formTitle.textContent === 'Login') {
        formTitle.textContent = 'Cadastro';
        authButton.textContent = 'Cadastrar';
        toggleForm.textContent = 'Já tem uma conta? Faça login';
        authMessage.classList.remove('alert-danger');
        authMessage.classList.add('alert-success');
    } else {
        formTitle.textContent = 'Login';
        authButton.textContent = 'Entrar';
        toggleForm.textContent = 'Não tem uma conta? Cadastre-se';
        authMessage.classList.remove('alert-success');
        authMessage.classList.add('alert-danger');
    }
});

document.getElementById('authForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formTitle = document.getElementById('formTitle').textContent;
    const authMessage = document.getElementById('authMessage');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (formTitle === 'Login') {
        // Lógica de login
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('authenticated', 'true');
                window.location.href = 'index.html';
            } else {
                authMessage.textContent = 'Usuário ou senha inválidos.';
                authMessage.style.display = 'block';
            }
        });
    } else {
        // Lógica de cadastro
        registerUser(username, password);
    }
});
