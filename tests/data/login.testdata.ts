export const LOGIN_TEST_DATA = {
  baseUrl: 'https://demoapp.alchemistudio.ai/login',
  testSelectors: {
    usernameInput: 'username-text-input',
    passwordInput: 'password-text-input',
    submitButton: 'submit-button',
  },
  validCredentials: {
    email: 'jehoz.intern@zentience.co',
    password: 'Zen@Micro05',
  },
  invalidCredentials: {
    wrongUsername: {
      email: 'invalid.user@zentience.co',
      password: 'Login@123',
      errorMessage: 'Invalid credentials',
    },
    wrongPassword: {
      email: 'jehoz.intern@zentience.co',
      password: 'WrongPassword123',
      errorMessage: 'Invalid credentials',
    },
    bothWrong: {
      email: 'invalid.user@zentience.co',
      password: 'WrongPassword123',
      errorMessage: 'Invalid credentials',
    },
  },
};