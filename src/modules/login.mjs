import { loginUser } from "./auth.mjs";

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginResult = await loginUser(email, password);

  if (loginResult.success) {
    window.location.href = '../profile/index.html';
  } else {
    console.error('Login failed:', loginResult.error);
  }
});
