import { API_URLS } from "../modules/constants.mjs";
import { updateTimer } from "../modules/listings.mjs";
import { fetchData } from "../modules/api.mjs";
import { deleteListing } from "../modules/delete-listing.mjs";
document.addEventListener("DOMContentLoaded", async function () {
  const listingId = getListingIdFromURL();
  const { success, data } = await fetchListingDetails(listingId);

  if (success) {
    displayListingDetails(data);
  } else {
    console.error("Failed to fetch listing details:", data.error);
  }
  const deleteButton = document.getElementById("delete-button");
  
  deleteButton.addEventListener("click", async function () {
      const listingId = getListingIdFromURL();
      const confirmDelete = confirm("Are you sure you want to delete this listing?");

      if (confirmDelete) {
          const success = await deleteListing(listingId);

          if (success) {
            const messageContainer = document.getElementById("message-container");

            messageContainer.innerHTML = '<div class="h6 my-3 alert alert-primary">Listing deleted. Redirecting to profile...</div>';

            setTimeout(function () {
                location.href = "/profile/";
            }, 3000);
        } else {
            console.log("Failed to delete the listing. Please try again.");
            const messageContainer = document.getElementById("message-container");
            messageContainer.innerHTML = '<div class="h6 my-3 alert alert-danger">Failed to delete the listing. Please try again.</div>';
        }
      }
  });
  const editButton = document.getElementById("edit-button");
  const saveButton = document.getElementById("save-button");
  const editListingForm = document.getElementById("edit-listing-form");
  editListingForm.style.display = "none";
  editButton.addEventListener("click", function () {
    editListingForm.style.display = "block";
  });
  saveButton.addEventListener("click", async function () {
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML = "";
    document
      .getElementById("edit-listing-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const newTitle = document.getElementById("edit-title").value;
        const newImage = document.getElementById("edit-listing-image").value;
        const newTags = document.getElementById("edit-tags").value;
        const newDescription =
          document.getElementById("edit-description").value;

        if (!newTitle && !newImage && !newTags && !newDescription) {
          messageContainer.innerHTML =
            '<div class="h6 my-3 alert alert-warning">You can\'t send an empty form. Please make changes before submitting.</div>';
          return;
        }
        const editedData = {};

        if (newTitle) {
          editedData.title = newTitle;
        }

        if (newImage) {
          editedData.media = [newImage];
        }

        if (newTags) {
          editedData.tags = newTags.split(",").map((tag) => tag.trim());
        }

        if (newDescription) {
          editedData.description = newDescription;
        }

        const listingId = getListingIdFromURL();
        const success = await editListing(listingId, editedData);

        if (success) {
          editListingForm.style.display = "none";
          messageContainer.innerHTML =
            '<div class="h6 my-3 alert alert-primary">Success! Updating your listing...</div>';
          setTimeout(function () {
            location.reload();
          }, 2000);
        } else {
          messageContainer.innerHTML =
            '<div class="h6 my-3 alert alert-danger">Failed to edit the listing. Please try again.</div>';
        }
      });
  });
});

function getListingIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");
  return listingId;
}

async function fetchListingDetails(listingId) {
  try {
    const queryParams = new URLSearchParams({ _bids: true });
    const response = await fetch(
      `${API_URLS.LISTINGS}/${listingId}?${queryParams}`
    );
    const data = await response.json();
    console.log(data);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      data: { error: "Failed to fetch listing details" },
    };
  }
}

function displayListingDetails(listingDetails) {
  const carouselInner = document.getElementById("carouselInner");
  const listingTitle = document.getElementById("listingTitle");
  const listingDescription = document.getElementById("listingDescription");
  const deadlineElement = document.getElementById("listing-deadline");
  const listingBidCount = document.getElementById("bid-count");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  if (listingDetails.media.length > 1) {
    prevButton.style.display = "block";
    nextButton.style.display = "block";
  } else {
    prevButton.style.display = "none";
    nextButton.style.display = "none";
  }

  carouselInner.innerHTML = "";
  listingDetails.media.forEach((imageUrl, index) => {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (index === 0) {
      item.classList.add("active");
    }

    const image = document.createElement("img");
    image.classList.add("d-block", "w-100");
    image.src = imageUrl;
    item.appendChild(image);

    carouselInner.appendChild(item);
    
  });

  listingTitle.textContent = listingDetails.title;
  listingDescription.textContent = listingDetails.description;
  const deadlineDate = new Date(listingDetails.endsAt).toLocaleString();
  deadlineElement.textContent = `Time left: ${deadlineDate}`;
  deadlineElement.classList.add("text-danger", "h6");
  updateTimer(deadlineElement, listingDetails.endsAt);
  const bidCount = listingDetails._count.bids;
  listingBidCount.textContent = `Current bids: ${bidCount}`;
  if (listingDetails.bids && listingDetails.bids.length > 0) {
    const latestBidIndex = listingDetails.bids.length - 1;
    const latestBidAmount = listingDetails.bids[latestBidIndex].amount;
    const latestBidElement = document.getElementById("current-bid");
    if (latestBidElement) {
      latestBidElement.textContent = `Current Bid: ${latestBidAmount} $`;
    }
  }
}

async function editListing(listingId, editedData) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${API_URLS.LISTINGS}/${listingId}`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedData),
    };

    const response = await fetchData(url, options);

    if (response.success) {
      console.log("Listing edited successfully");
      return true;
    } else {
      console.error("Failed to edit listing:", response.error);

      return false;
    }
  } catch (error) {
    console.error("Error editing listing:", error);

    return false;
  }
}
