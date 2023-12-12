const isLoggedIn = localStorage.getItem('accessToken') !== null;

function updateBanner() {
  const banner = document.getElementById('banner');
  if (isLoggedIn && banner) {
    const credits = getUserCredits();
    console.log("User is logged in and there is a banner");


    const creditsParagraph = document.createElement('p');
    creditsParagraph.innerText = `Credits: ${credits}`;

    banner.appendChild(creditsParagraph);
  }
}

function getUserCredits() {
  const credits = localStorage.getItem('credits');
  return credits;
}


document.addEventListener('DOMContentLoaded', updateBanner);
