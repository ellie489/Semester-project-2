import { registerUser } from "../modules/auth.mjs";
document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const avatar = document.getElementById('avatar').value;

  clearMessage();

  const registrationResult = await registerUser(name, email, password, avatar);

  if (registrationResult.success) {
    showMessage('Registration successful! You can now log in to your account.');
  } else {
    displayErrorMessage(registrationResult.error, 'register-feedback');
  }
});

function displayErrorMessage(error, errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  errorElement.textContent = error;
  errorElement.classList.add("alert", "alert-danger");
  errorElement.style.display = 'block';
}

function showMessage(message) {
  displayErrorMessage(message, 'register-feedback');
  const registerFeedback = document.getElementById('register-feedback');
  registerFeedback.classList.remove("alert-danger");
  registerFeedback.classList.add("alert-success");
}

function clearMessage() {
  const registerFeedback = document.getElementById('register-feedback');
  registerFeedback.textContent = '';
  registerFeedback.style.display = 'none';
}
