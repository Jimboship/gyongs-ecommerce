const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const switchButtons = document.querySelectorAll('[data-form-switch]');

switchButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        const target = button.dataset.formSwitch;

        if (target === 'register') {
            loginContainer.classList.add('hidden');
            registerContainer.classList.remove('hidden');
        } else if (target === 'login') {
            registerContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        }
    });
});
