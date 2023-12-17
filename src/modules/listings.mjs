import { API_URLS } from "./constants.mjs";
import { fetchData } from "./api.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const listingsContainer = document.getElementById("listings-container");

  if (listingsContainer) {
    try {
        
      const { success, data } = await fetchData(`${API_URLS.LISTINGS}?_bids=true`);

      if (success) {
        const listings = data;
        console.log(data)

        renderListings(listings, listingsContainer);

        adjustLayout(listingsContainer);
      } else {
        console.error("Failed to fetch listings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }
});

function adjustLayout(container) {
  const listingElements = container.querySelectorAll(".col-md-6, .col-md-12");

  for (let i = 0; i < listingElements.length; i++) {
    const listingElement = listingElements[i];

    if (i < 4) {
      listingElement.classList.remove("col-12");
      listingElement.classList.add("col-6", "col-lg-3");
    } else if (i % 5 === 4) {
      listingElement.classList.remove("col-6");
      listingElement.classList.add("col-12", "large", "col-lg-6");
    } else {
      listingElement.classList.remove("col-12");
      listingElement.classList.add("col-6", "col-lg-3");
    }
  }
}

function renderListings(listings, container) {
  container.innerHTML = "";

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];

    if (isListingExpired(listing)) {
      continue;
    }

    const listingElement = createListingElement(listing);

    if (listingElement) {
      const colDiv = document.createElement("div");

      if (i < 4) {
        colDiv.classList.add("col-6", "col-lg-3");
      } else if (i % 5 === 4) {
        colDiv.classList.add("col-12", "col-lg-6");
      } else {
        colDiv.classList.add("col-6", "col-lg-3");
      }

      colDiv.addEventListener("click", () => openDetailsPage(listing.id));
      colDiv.appendChild(listingElement);
      container.appendChild(colDiv);
    }
  }
}

export { renderListings}

function openDetailsPage(listingId) {

    window.location.href = `/listing-details/index.html?id=${listingId}`;
  }
export {openDetailsPage }

function isListingExpired(listing) {
    const now = new Date().getTime();
    const deadline = new Date(listing.endsAt).getTime();
    return deadline <= now;
  }
  
function createListingElement(listing) {
  if (!listing || typeof listing !== "object") {
    console.error("Invalid listing object:", listing);
    return null;
  }

  if (!listing.media || listing.media.length < 1) {
    return null;
  }

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "mb-3", "card-invisible");

  const imageElement = document.createElement("img");
  imageElement.src = listing.media[0];
  imageElement.alt = "Listing Image";
  imageElement.classList.add("card-img");
  cardDiv.appendChild(imageElement);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const titleElement = document.createElement("h4");
  titleElement.classList.add("card-title");
  titleElement.textContent = listing.title;
  cardBody.appendChild(titleElement);

  if (listing.bids && listing.bids.length > 0) {
    const currentBid = document.createElement("h6");
    const latestBidIndex = listing.bids.length - 1;
    const latestBidAmount = listing.bids[latestBidIndex].amount;
    currentBid.textContent = `Current bid: ${latestBidAmount} $`;
    currentBid.classList.add("card-text","fw-bold");
    cardBody.appendChild(currentBid);
  }

  const deadlineElement = document.createElement("p");
  deadlineElement.classList.add("card-text", "text-danger");
  const deadlineDate = new Date(listing.endsAt).toLocaleString();
  deadlineElement.textContent = deadlineDate;
  cardBody.appendChild(deadlineElement);

  updateTimer(deadlineElement, listing.endsAt);

  cardDiv.appendChild(cardBody);

  return cardDiv;
}

export { createListingElement }
function updateTimer(timerElement, deadline) {
    function update() {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;
  
 
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
        timerElement.textContent = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
      
    }
  
    update();
    setInterval(update, 1000);
  }

export { updateTimer };