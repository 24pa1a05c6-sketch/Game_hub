// index.js

const featuredContainer = document.getElementById("featured-games");
const searchBar = document.getElementById("search-bar");

function renderFeatured(filter = "") {
  if (!featuredContainer) return;

  featuredContainer.innerHTML = "";
  const featuredGames = games.slice(0, 10);
  const query = filter.trim().toLowerCase();

  const filteredGames = featuredGames.filter((game) => {
    if (!query) return true;
    return (
      game.name.toLowerCase().includes(query) ||
      game.category.toLowerCase().includes(query)
    );
  });

  if (filteredGames.length === 0) {
    featuredContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem; padding:6px 2px;">No games found for “${filter}”.</p>`;
    return;
  }

  filteredGames.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("game-card");

    card.innerHTML = `
      ${game.sale ? `<div class="sale-badge">SALE</div>` : ""}
      <img src="${game.img}" alt="${game.name}" onerror="this.onerror=null; this.src='https://placehold.co/300x400/121427/8f9bb7?text=Cover+Not+Found';">
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>${game.category}</p>
        <div class="price">$${game.price.toFixed(2)} ${
          game.sale
            ? `<span class="original-price">$${game.original.toFixed(2)}</span>`
            : ""
        }</div>
        <div class="rating">${"★".repeat(game.rating)}${"☆".repeat(5 - game.rating)}</div>
        <button class="view-btn">View</button>
        <button class="add-cart-btn">Add to Cart</button>
        <button class="wishlist-btn">Wishlist</button>
      </div>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => {
      localStorage.setItem("selectedGame", JSON.stringify(game));
      window.location.href = "product.html";
    });

    card.querySelector(".add-cart-btn").addEventListener("click", () => {
      const cart = getStoredArray("cart");
      cart.push(game);
      setStoredArray("cart", cart);
      updateHeaderCounters();
      showToast(`${game.name} added to cart`);
    });

    card.querySelector(".wishlist-btn").addEventListener("click", () => {
      const wishlist = getStoredArray("wishlist");
      if (!wishlist.some((g) => g.id === game.id)) {
        wishlist.push(game);
        setStoredArray("wishlist", wishlist);
        updateHeaderCounters();
        showToast(`${game.name} added to wishlist`);
      } else {
        showToast(`${game.name} is already in wishlist`);
      }
    });

    featuredContainer.appendChild(card);
  });
}

renderFeatured();

if (searchBar) {
  searchBar.addEventListener("input", (e) => renderFeatured(e.target.value));
}
