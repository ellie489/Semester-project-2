import { registerUser } from "../modules/auth.mjs";

document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const avatar = document.getElementById('avatar').value;

  const registrationResult = await registerUser(name, email, password, avatar);

  if (registrationResult.success) {
    console.log('Registration successful. Redirecting to login page...', registrationResult.data);
  } else {

    console.error('Registration failed:', registrationResult.error);

  }
});
