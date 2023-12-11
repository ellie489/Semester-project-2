import { loginUser } from "./auth.js";

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginResult = await loginUser(email, password);

  if (loginResult.success) {
    console.log('Login successful');
    console.log('User data:', loginResult.userData);
  } else {
    console.error('Login failed:', loginResult.error);
  }
});
