const isLoggedIn = localStorage.getItem("accessToken");
const signInNavItem = document.getElementById('sign-in-nav-item');

if (isLoggedIn) {
  signInNavItem.innerHTML = `
    <a href="/profile/" class="btn btn-secondary mx-3 py-0 d-flex align-items-center" role="button">
      Profile<img src="../../icons/Profile Icon.svg" alt="profile icon" class="mx-2" />
    </a>`;
} else {
  signInNavItem.innerHTML = `
    <a href="/login/" class="btn btn-secondary mx-3 py-0 d-flex align-items-center" role="button">
      Sign In<img src="../../icons/Profile Icon.svg" alt="sign in icon" class="mx-2" />
    </a>`;

  const signInButton = signInNavItem.querySelector('a');
  signInButton.addEventListener('click', function(event) {
    event.preventDefault(); 
    window.location.href = '/login/'; 
  });
}

const banner = document.getElementById('banner');
if (!isLoggedIn) {
  banner.style.display = 'none';
}
