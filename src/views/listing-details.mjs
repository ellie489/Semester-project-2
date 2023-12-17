import { fetchData } from "../modules/api.mjs";
import { API_URLS } from "../modules/constants.mjs";
import { updateTimer } from "../modules/listings.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const bidButton = document.getElementById("bid-button");
  const viewBidsButton = document.getElementById("view-bids-button");
  const bidsListContainer = document.getElementById("bids-list");
  const noBidsMessage = document.getElementById("no-bids-message");

  if (!bidButton || !viewBidsButton || !bidsListContainer || !noBidsMessage) {
    console.error("Required elements not found");
    return;
  }

  const listingId = getListingIdFromURL();
  const { success, data } = await fetchListingDetails(listingId);

  if (success) {
    displayListingDetails(data);
  } else {
    console.error("Failed to fetch listing details:", data.error);
  }

  const bidStatusMessage = document.getElementById("bid-status-message");

  bidButton.addEventListener("click", async function () {
    const bidAmountInput = document.getElementById("bid-amount");
    const bidAmount = parseInt(bidAmountInput.value, 10);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {

      window.location.href = "/register/";
      return;
    }
    if (!isNaN(bidAmount) && bidAmount > 0) {
      try {
        const bidResult = await placeBid(listingId, bidAmount);

        if (bidResult.success) {
          window.alert('Bid placed successfully! Click OK to refresh the page.');

          window.location.reload();

        } else {
          console.error("Failed to place bid:", bidResult.data.error);
          if (bidStatusMessage) {
            bidStatusMessage.textContent = `Failed to place bid: ${bidResult.data.error}`;
            bidStatusMessage.classList.add("alert", "alert-danger");
          }
        }
      } catch (error) {
        console.error("Error placing bid:", error);
      }
    } else {
      bidStatusMessage.textContent = `Invalid bid amount. The bid must be a number.`;
      bidStatusMessage.classList.add("alert", "alert-danger");
    }
  });
  if (bidsListContainer) {
    bidsListContainer.style.display = "none";
  }

  if (viewBidsButton && bidsListContainer) {
    viewBidsButton.addEventListener("click", function () {
      const bidHistoryVisible = bidsListContainer.style.display === "none";

      viewBidsButton.textContent = bidHistoryVisible
        ? "Hide Bids"
        : "View Bids";
      bidsListContainer.style.display = bidHistoryVisible ? "block" : "none";
    });
  }
});

function getListingIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
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
  const bidsListContainer = document.getElementById("bids-list");
  const noBidsMessage = document.getElementById("no-bids-message");
  const latestBidElement = document.getElementById("current-bid");


  if (listingDetails.bids && listingDetails.bids.length > 0 && latestBidElement) {
    const latestBidAmount = listingDetails.bids[0].amount;
    latestBidElement.innerHTML = `<p>Current Bid: ${latestBidAmount} $</p>`;
  }


  if (bidsListContainer) {
    bidsListContainer.innerHTML = "<h4>Bid History:</h4>";
    bidsListContainer.classList.add("mt-3");
    const bidsList = document.createElement("ul");
    bidsList.classList.add("mt-3");

    const sortedBids = listingDetails.bids.sort((a, b) => new Date(b.created) - new Date(a.created));

    sortedBids.forEach((bid) => {
      const createdDate = new Date(bid.created).toLocaleString();
      const bidItem = document.createElement("li");
      bidItem.classList.add("alert", "alert-primary");
      bidItem.innerHTML = `<p>Amount: ${bid.amount} $</p><p>Bidder Name: ${bid.bidderName}</p><p>Date: ${createdDate}</p>`;
      bidsList.appendChild(bidItem);
    });

    bidsListContainer.appendChild(bidsList);
    if (noBidsMessage) {
      noBidsMessage.style.display = sortedBids.length > 0 ? "none" : "block";
    }
  } else {
    if (noBidsMessage) {
      noBidsMessage.style.display = "block";
    }
  }


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
    item.classList.add("carousel-item", index === 0 ? "active" : "");

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
}


async function placeBid(listingId, bidAmount) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URLS.LISTINGS}/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error("Bid error:", responseData.errors[0]);
      return {
        success: false,
        data: { error: responseData.errors[0].message },
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Bid error:", error);
    return {
      success: false,
      data: { error: "An error occurred during bid placement" },
    };
  }
}
