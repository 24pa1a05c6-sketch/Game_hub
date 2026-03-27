// product.js

const productCard = document.getElementById("product-card");

function renderProduct() {
  if (!productCard) return;

  const raw = localStorage.getItem("selectedGame");
  if (!raw) {
    productCard.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem;">No game selected. Go back to the store.</p>`;
    return;
  }

  const game = JSON.parse(raw);
    // track recently viewed
  try {
    const recent = getStoredArray("recentGames");
    const withoutCurrent = recent.filter((g) => g.id !== game.id);
    withoutCurrent.unshift(game);
    const trimmed = withoutCurrent.slice(0, 8);
    setStoredArray("recentGames", trimmed);
  } catch (e) {
    console.error("recentGames error", e);
  }


  productCard.innerHTML = `
    <img src="${game.img}" alt="${game.name}" onerror="this.onerror=null; this.src='https://placehold.co/300x400/121427/8f9bb7?text=Cover+Not+Found';">
    <div class="game-info">
      <h2>${game.name}</h2>
      <p>${game.category}</p>
      <div class="rating">${"★".repeat(game.rating)}${"☆".repeat(5 - game.rating)}</div>
      <div class="price">$${game.price.toFixed(2)} ${
        game.sale
          ? `<span class="original-price">$${game.original.toFixed(2)}</span>`
          : ""
      }</div>
      <p style="margin-top:8px; font-size:0.88rem; color:#a9b2d5;">
        This is a demo description for ${game.name}. In a full product, this would describe gameplay,
        features, supported platforms and more.
      </p>
      <button id="product-add-cart" class="add-cart-btn">Add to Cart</button>
      <button id="product-wishlist" class="wishlist-btn">Wishlist</button>
    </div>
  `;

  document.getElementById("product-add-cart").addEventListener("click", () => {
    const cart = getStoredArray("cart");
    cart.push(game);
    setStoredArray("cart", cart);
    updateHeaderCounters();
    showToast(`${game.name} added to cart`);
  });

  document.getElementById("product-wishlist").addEventListener("click", () => {
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
}

renderProduct();
