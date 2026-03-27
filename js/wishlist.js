// wishlist.js

const wishlistContainer = document.getElementById("wishlist-container");

function renderWishlist() {
  if (!wishlistContainer) return;

  const wishlist = getStoredArray("wishlist");
  wishlistContainer.innerHTML = "";

  if (!wishlist.length) {
    wishlistContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem;">Your wishlist is empty.</p>`;
    return;
  }

  wishlist.forEach((game) => {
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
        <button class="remove-wishlist-btn">Remove</button>
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

    card.querySelector(".remove-wishlist-btn").addEventListener("click", () => {
      const wishlistNow = getStoredArray("wishlist");
      const updated = wishlistNow.filter((g) => g.id !== game.id);
      setStoredArray("wishlist", updated);
      updateHeaderCounters();
      showToast(`${game.name} removed from wishlist`);
      renderWishlist();
    });

    wishlistContainer.appendChild(card);
  });
}

renderWishlist();
