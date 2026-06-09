document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const messageContainer = document.getElementById('message-container');

    // Errores específicos por campo
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    // --- Cuentas de Prueba ---
    const mockAccounts = [
        { email: 'admin@yahoo.com', password: 'Admin123*' },
        { email: 'usuario@hotmail.com', password: 'Usuario123*' }
    ];

    // ==========================================================================
    // Lógica del Modo Oscuro (Persistencia con LocalStorage)
    // ==========================================================================
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.textContent = '☀️';
        }
    });

    // ==========================================================================
    // Mostrar / Ocultar Contraseña
    // ==========================================================================
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
        togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    // ==========================================================================
    // Validaciones y Envío del Formulario
    // ==========================================================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita la recarga de la página

        // Resetear estados visuales previos
        resetValidationStates();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        let isValid = true;

        // 1. Validación del Correo Electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailValue) {
            showFieldError(emailInput, emailError, 'El correo electrónico no puede estar vacío.');
            isValid = false;
        } else if (!emailValue.includes('@')) {
            showFieldError(emailInput, emailError, 'El correo debe incluir un símbolo "@".');
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            showFieldError(emailInput, emailError, 'Introduce un formato de correo válido (ej: usuario@dominio.com).');
            isValid = false;
        }

        // 2. Validación de la Contraseña
        if (!passwordValue) {
            showFieldError(passwordInput, passwordError, 'La contraseña no puede estar vacía.');
            isValid = false;
        } else if (passwordValue.length < 8) {
            showFieldError(passwordInput, passwordError, 'La contraseña debe tener al menos 8 caracteres.');
            isValid = false;
        }

        // Si los campos individuales no cumplen los requisitos mínimos, detenemos aquí
        if (!isValid) return;

        // 3. Verificación de Credenciales (Cuentas de prueba)
        const accountFound = mockAccounts.find(
            account => account.email.toLowerCase() === emailValue.toLowerCase() && account.password === passwordValue
        );

        if (accountFound) {
            showGlobalMessage('¡Inicio de sesión exitoso!', 'success');
            // Aquí se redirigiría al panel principal en una app real
        } else {
            showGlobalMessage('Correo o contraseña incorrectos.', 'error');
            // Resaltamos de forma general ambos campos por seguridad
            emailInput.classList.add('invalid');
            passwordInput.classList.add('invalid');
        }
    });

    // --- Funciones Auxiliares Helper ---
    
    function showFieldError(inputElement, errorElement, message) {
        inputElement.classList.add('invalid');
        errorElement.textContent = message;
    }

    function resetValidationStates() {
        // Limpiar errores debajo de los inputs
        emailInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        emailError.textContent = '';
        passwordError.textContent = '';
        
        // Ocultar caja de mensajes generales
        messageContainer.className = 'message-box hidden';
        messageContainer.textContent = '';
    }

    function showGlobalMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-box ${type}`; // Aplica clase 'error' o 'success'
    }
});
