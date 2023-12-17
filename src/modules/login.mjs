import { loginUser } from "./auth.mjs";

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginResult = await loginUser(email, password);

  if (loginResult.success) {
    window.location.href = '../profile/index.html';
  } else {
    displayErrorMessage(loginResult.error);
  }
});

function displayErrorMessage(error) {
  const errorElement = document.getElementById('login-error-message');
  errorElement.textContent = error;
  errorElement.classList.add("alert", "alert-danger");
}
