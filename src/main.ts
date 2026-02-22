import { AuthService, UserRepository } from './auth';

const authService = new AuthService(new UserRepository());

let isLoginMode = true;

const form = document.getElementById('auth-form') as HTMLFormElement;
const title = document.getElementById('form-title') as HTMLHeadingElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const toggleModeBtn = document.getElementById('toggle-mode') as HTMLDivElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

const emailError = document.getElementById('email-error') as HTMLDivElement;
const passwordError = document.getElementById('password-error') as HTMLDivElement;

toggleModeBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    title.textContent = isLoginMode ? 'Login' : 'Register';
    submitBtn.textContent = isLoginMode ? 'Login' : 'Register';
    toggleModeBtn.textContent = isLoginMode ? 'Need an account? Register here' : 'Already have an account? Login';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    // 前端格式检查
    const isEmailValid = authService.validateEmail(email);
    const isPasswordValid = isLoginMode ? true : authService.validatePassword(password); // 登录时通常不严格校验复杂度，只在注册时校验

    emailError.style.display = isEmailValid ? 'none' : 'block';
    passwordError.style.display = isPasswordValid ? 'none' : 'block';

    if (!isEmailValid || !isPasswordValid) return;

    // 执行业务逻辑
    const result = isLoginMode ? authService.login(email, password) : authService.register(email, password);

    if (result.success) {
        alert(result.message); // 实际项目中这里会进行页面跳转
    } else {
        alert(`Error: ${result.message}`);
    }
});