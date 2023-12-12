import { getUserProfile } from "../modules/auth.mjs";
import { API_URLS } from "../modules/constants.mjs";
import { fetchData } from "../modules/api.mjs";
import { showModal, hideModal } from '../modules/modal.mjs';

document.addEventListener("DOMContentLoaded", async function () {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("name");

  if (accessToken) {
    const profileResult = await getUserProfile(accessToken, userName);

    if (profileResult.success) {
      const userProfile = profileResult.userProfile;

      updateProfileInfo(userProfile);
    } else {
      console.error("Failed to fetch user profile:", profileResult.error);
    }
  } else {
    console.error("Access token not available. User not logged in.");
  }
  const avatarForm = document.getElementById("avatarForm");
  if (avatarForm) {
    avatarForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      const newImageUrl = document.getElementById("new-image").value;
      if (newImageUrl) {
        // Call a function to make the PUT request
        changeAvatar(newImageUrl);
      }
    });
  }
});
async function changeAvatar(newImageUrl) {
  const accessToken = localStorage.getItem('accessToken');
  const userName = localStorage.getItem('name');

  if (accessToken) {
    const url = `${API_URLS.PROFILE}/${userName}/media`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ avatar: newImageUrl }),
    };

    const response = await fetchData(url, options);

    if (response.success) {
      console.log('Avatar changed successfully');
      // You might want to update the displayed avatar immediately
      updateProfileInfo(response.data);
      document.getElementById('new-image').value = '';
    } else {
      console.error('Failed to change avatar:', response.error);
    }
  } else {
    console.error('Access token not available. User not logged in.');
  }
}
function updateProfileInfo(userProfile) {
  const profileAvatar = document.getElementById("profile-avatar");
  const modalAvatar = document.getElementById("modal-avatar");
  const userNameElement = document.getElementById("username");
  const creditsElement = document.getElementById("credits");

  profileAvatar.src = userProfile.avatar;

  if (modalAvatar) {
    modalAvatar.src = userProfile.avatar;
  }

  userNameElement.innerText = `Hi, ${userProfile.name}`;
  creditsElement.innerText = `Credits: ${userProfile.credits}`;
}


document.getElementById('profile-avatar').addEventListener('click', function () {
 showModal();
});


document.getElementById('update-avatar-button').addEventListener('click', function () {
 hideModal();
});

document.getElementById('close-modal-button').addEventListener('click', function () {
  hideModal();
 });