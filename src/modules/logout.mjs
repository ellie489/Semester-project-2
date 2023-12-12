document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sign-out").addEventListener("click", logout);
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    localStorage.removeItem("credits");
    localStorage.removeItem("avatar");
    window.location.href = "../index.html";
  }
});
