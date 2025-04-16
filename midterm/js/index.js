const API_URL =
  "https://gist.githubusercontent.com/erradi/472379c776dc7d4ac7e0d4156404bc28/raw/f2f0a81d7f79e2976dcfc79858a83df9c2110e7e/crypto.json";

  
  fetchAndDisplayCoins();

  async function fetchAndDisplayCoins() {
      const coinList = document.getElementById("coinList");
  
      const response = await fetch(API_URL);
      const coins = await response.json();
  
      coinList.innerHTML = "";
  
      // Create cards
      coins.forEach((coin) => {
        const coinCard = document.createElement("div");
        coinCard.className = "coin-card";
  
        coinCard.innerHTML = `
          <img src="${coin.icon}" alt="${coin.name} Icon">
          <h2>${coin.name}</h2>
          <p>Symbol: ${coin.symbol}</p>
          <p>Price: $${parseFloat(coin.price)}</p>
          <p>Market Cap: $${parseInt(coin.cap)}</p>
          <button class="addWL">Add to Wishlist</button> 
        `;
        // The class in the button is needed to add the event listener
        // Very important
  
        // Add clisk event to button
        const addWL = coinCard.querySelector(".addWL");
        addWL.addEventListener("click", () => addToWishlist(coin));
  
        coinList.appendChild(coinCard);
      });
    
  }

  document.getElementById("showWishlist").addEventListener("click", displayWishlist);

  // Wishlist here is an array. Saved as localStorage item named "wishlist"
  // So, operations on Wishlist are operations on that item in localStorage

  function getWishlist() {
    const wishlist = localStorage.getItem("wishlist");
    if (wishlist) {
      return JSON.parse(wishlist);
    } else {
      return [];
    }
  }
  
  function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  function addToWishlist(coin) {
    const wishlist = getWishlist();
  
    let isAlreadyInWishlist = false;
    wishlist.forEach((item) => {
      if (item.symbol === coin.symbol) {
        isAlreadyInWishlist = true;
      }
    });

    if (isAlreadyInWishlist) {
      alert(`${coin.symbol} is already in the wishlist!`);
      return;
    }

    // Else ... add the coin
    wishlist.push(coin);
    // Save it back to localStorage ... important
    saveWishlist(wishlist);
    alert(`${coin.symbol} has been added to the wishlist!`);
  }

  function removeFromWishlist(coin) {
    let wishlist = getWishlist();
    // Remove that particular coin
    wishlist = wishlist.filter((coinn) => coinn.symbol !== coin.symbol);
    // Save it back to localStorage ... important
    saveWishlist(wishlist);
    // Display the wishlist again
    alert(`${coin.symbol} has been removed from the wishlist`);
    displayWishlist();
  }

  function displayWishlist() {
    const coinList = document.getElementById("coinList");
    const wishlist = getWishlist();
  
    // I get error without this. Also, becasue innerHTML is not empty and is listing coins
    // We will use the same div to display the wishlist
    coinList.innerHTML = "";
  
    if (wishlist.length === 0) {
      coinList.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    // Else ... we have coins in the wishlist
  
    // Create the wishlist container
    const wishlistCard = document.createElement("div");
    wishlistCard.className = "wishlist-card";
  
    // Add title
    const wishlistTitle = document.createElement("h2");
    wishlistTitle.textContent = "Wishlist";
    wishlistCard.appendChild(wishlistTitle);

    // Add home link
    const homeLink = document.createElement("a");
    homeLink.href = "/index.html"; 
    homeLink.textContent = "Back to Home";
    wishlistCard.appendChild(homeLink);

    // Add somespace
    wishlistCard.appendChild(document.createElement("br"));
    wishlistCard.appendChild(document.createElement("br"));
    wishlistCard.appendChild(document.createElement("br"));

    wishlist.forEach((coin) => {
      const coinCard = document.createElement("div");
      coinCard.className = "coin-card";
  
      coinCard.innerHTML = `
        <img src="${coin.icon}" alt="${coin.name} Icon">
        <h2>${coin.name}</h2>
        <p>Symbol: ${coin.symbol}</p>
        <p>Price: $${parseFloat(coin.price)}</p>
        <p>Market Cap: $${parseInt(coin.cap)}</p>
        <button class="removeWL">Remove</button>
      `;
      // This is for the event for Remove button. Same like before with addWL.
      const removeWL = coinCard.querySelector(".removeWL");
      removeWL.addEventListener("click", () => removeFromWishlist(coin));
  
      wishlistCard.appendChild(coinCard);
    });
  
    coinList.appendChild(wishlistCard);
  }

  





  

/*

// Home Page - coin-card
<div class="coin-card">
    <img src="https://via.placeholder.com/50" alt="Coin Icon">
    <h2>Bitcoin</h2>
    <p>Symbol: BTC</p>
    <p>Price: $61,915.5</p>
    <p>Market Cap: $1,121,393,739,784</p>
    <button>Add to Wishlist</button>
</div>


// Wishlist Card
<div class = "wishlist-card">
<h2>Wishlist</h2>
<a>baclk</a>
<div class="coin-card">
    <img src="https://via.placeholder.com/50" alt="Coin Icon">
    <h2>Ethereum</h2>
    <p>Symbol: ETH</p>
    <p>Price: $3,895.7</p>
    <p>Market Cap: $467,823,479,682</p>
    <button>Remove</button>
</div>
</div>

*/
