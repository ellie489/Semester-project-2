import { getUserProfile } from '../modules/auth.mjs';

document.addEventListener('DOMContentLoaded', async function () {
    const accessToken = localStorage.getItem('accessToken');
    const userName = localStorage.getItem('name');
  
    if (accessToken) {
      const profileResult = await getUserProfile(accessToken, userName);
  
      if (profileResult.success) {
        const userProfile = profileResult.userProfile;
  
        updateProfileInfo(userProfile);
      } else {
        console.error('Failed to fetch user profile:', profileResult.error);
      }
    } else {
      console.error('Access token not available. User not logged in.');
    }
  });
  
  function updateProfileInfo(userProfile) {
    const profileAvatar = document.getElementById('profile-avatar');
    const modalAvatar = document.getElementById('modal-avatar');
    const userNameElement = document.getElementById('username');
    const creditsElement = document.getElementById('credits');

    profileAvatar.src = userProfile.avatar;
  
    if (modalAvatar) {
      modalAvatar.src = userProfile.avatar;
    }

    userNameElement.innerText = `Hi, ${userProfile.name}`;
    creditsElement.innerText = `Credits: ${userProfile.credits}`;
  }