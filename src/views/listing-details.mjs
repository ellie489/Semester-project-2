import { fetchData } from "../modules/api.mjs";
import { API_URLS } from "../modules/constants.mjs";
import { updateTimer } from "../modules/listings.mjs";
import { placeBid } from "../modules/bids.mjs";
document.addEventListener("DOMContentLoaded", async function () {
  // Get the listing ID from URL parameters or other means
  const listingId = getListingIdFromURL(); // Implement this function

  // Fetch listing details
  const { success, data } = await fetchListingDetails(listingId);

  if (success) {
    // Display listing details
    displayListingDetails(data);
  } else {
    console.error("Failed to fetch listing details:", data.error);
  }
});

function getListingIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");
  return listingId;
}

async function fetchListingDetails(listingId) {
  try {
    const queryParams = new URLSearchParams({ _bids: true });
    const response = await fetch(`${API_URLS.LISTINGS}/${listingId}?${queryParams}`);
    const data = await response.json();
    console.log(data)
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
    // Show carousel controls
    prevButton.style.display = 'block';
    nextButton.style.display = 'block';
  } else {
    // Hide carousel controls
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
  }
  // Update carousel items
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

  // Update text content
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
    const latestBidElement = document.getElementById('current-bid');
    if (latestBidElement) {
      latestBidElement.textContent = `Current Bid: ${latestBidAmount} $`;
    }
  }
}

document.addEventListener("DOMContentLoaded", async function () {

  const bidButton = document.getElementById("bid-button");
  bidButton.addEventListener("click", async function () {
    const bidAmountInput = document.getElementById("bid-amount");
    const bidAmount = parseInt(bidAmountInput.value, 10);

    // Get the listing ID
    const listingId = getListingIdFromURL();

    // Check if bid amount is valid
    if (!isNaN(bidAmount) && bidAmount > 0) {
      const bidResult = await placeBid(listingId, bidAmount);

      if (bidResult.success) {
        // Handle success, update UI, etc.
      } else {
        // Handle failure, show error message, etc.
        console.error("Failed to place bid:", bidResult.data.error);
      }
    } else {
      // Handle invalid bid amount, show error message, etc.
      console.error("Invalid bid amount");
    }
  });


});
