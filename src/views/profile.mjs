import { getUserProfile } from "../modules/auth.mjs";
import { API_URLS } from "../modules/constants.mjs";
import { fetchData } from "../modules/api.mjs";
import { showModal, hideModal } from "../modules/modal.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("name");

  if (accessToken) {
    const profileResult = await getUserProfile(accessToken, userName);

    if (profileResult.success) {
      const userProfile = profileResult.userProfile;

      updateProfileInfo(userProfile);
      fetchProfileListings(userName);
    } else {
      console.error("Failed to fetch user profile:", profileResult.error);
    }
  } else {
    window.alert("Access token not available. Please log in again.");
    window.location.href = '/login/'; 
  }

  const avatarForm = document.getElementById("avatarForm");
  if (avatarForm) {
    avatarForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const newImageUrl = document.getElementById("new-image").value;
      if (newImageUrl) {
        changeAvatar(newImageUrl);
      }
    });
  }
});

async function changeAvatar(newImageUrl) {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("name");

  if (accessToken) {
    const url = `${API_URLS.PROFILE}/${userName}/media`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ avatar: newImageUrl }),
    };

    const response = await fetchData(url, options);

    if (response.success) {
      console.log("Avatar changed successfully");
      updateProfileInfo(response.data);
      document.getElementById("new-image").value = "";
    } else {
      console.error("Failed to change avatar:", response.error);
    }
  } else {
    console.error("Access token not available. User not logged in.");
  }
}
function updateProfileInfo(userProfile) {
  const profileAvatar = document.getElementById("profile-avatar");
  const modalAvatar = document.getElementById("modal-avatar");
  const userNameElement = document.getElementById("username");
  const creditsElement = document.getElementById("credits");

  profileAvatar.src = userProfile.avatar || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png";

  if (modalAvatar) {
    modalAvatar.src = userProfile.avatar || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png";
  }

  userNameElement.innerText = `Hi, ${userProfile.name}`;
  creditsElement.innerText = `Credits: ${userProfile.credits}`;
}

document
  .getElementById("profile-avatar")
  .addEventListener("click", function () {
    showModal();
  });

document
  .getElementById("update-avatar-button")
  .addEventListener("click", function () {
    hideModal();
  });

document
  .getElementById("close-modal-button")
  .addEventListener("click", function () {
    hideModal();
  });

async function fetchProfileListings(userName) {
  const url = `${API_URLS.PROFILES}/${userName}/listings?includeListings=true`;

  try {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    console.log(data);
    const listingsContainer = document.getElementById("listing-container");
    listingsContainer.innerHTML = "";
    data.forEach((listing) => {
      const listingCard = createListingCard(listing);
      listingsContainer.appendChild(listingCard);
    });
  } catch (error) {
    console.error("Request error:", error);
    return { success: false, error: "An error occurred during the request" };
  }
}
function createListingCard(listing) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "mb-3");

  const imageElement = document.createElement("img");
  imageElement.src = listing.media[0];
  imageElement.alt = "Listing Image";
  imageElement.classList.add("card-img-top");
  cardDiv.appendChild(imageElement);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const titleElement = document.createElement("h5");
  titleElement.classList.add("card-title");
  titleElement.textContent = listing.title;
  cardBody.appendChild(titleElement);

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("card-text");
  descriptionElement.textContent = listing.description;
  cardBody.appendChild(descriptionElement);

  const deadlineElement = document.createElement("p");
  deadlineElement.classList.add("card-text");
  const deadlineDate = new Date(listing.endsAt).toLocaleString();
  deadlineElement.textContent = `Deadline: ${deadlineDate}`;
  cardBody.appendChild(deadlineElement);

  cardDiv.appendChild(cardBody);

  cardDiv.addEventListener("click", function () {
    openDetailsPage(listing.id);
  });
  return cardDiv;
}
function openDetailsPage(listingId) {
  window.location.href = `/profile/listing-details.html?id=${listingId}`;
}