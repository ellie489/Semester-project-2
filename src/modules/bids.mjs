import { API_URLS } from "./constants.mjs";

export async function placeBid(listingId, bidAmount) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Access token not found. Please log in.");
      return { success: false, data: { error: "Access token not found" } };
    }

    const bidData = {
      amount: bidAmount,
    };

    const queryParams = new URLSearchParams({ _bids: true });
    const urlWithQuery = `${
      API_URLS.LISTINGS
    }/${listingId}?${queryParams.toString()}`;

    const response = await fetch(urlWithQuery, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bidData),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("Bid placed successfully:", responseData);

      return { success: true, data: responseData };
    } else {
      console.error("Failed to place bid:", responseData.error);

      return { success: false, data: responseData };
    }
  } catch (error) {
    console.error("Error placing bid:", error);

    return { success: false, data: { error: "Error placing bid" } };
  }
}
