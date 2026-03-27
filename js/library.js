// library.js

const ownedContainer = document.getElementById("owned-container");
const wishlistLibContainer = document.getElementById("library-wishlist-container");
const recentContainer = document.getElementById("recent-container");

function buildCard(game, options = {}) {
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
      ${
        options.showRemove
          ? `<button class="remove-btn">${options.removeLabel || "Remove"}</button>`
          : ""
      }
    </div>
  `;

  card.querySelector(".view-btn").addEventListener("click", () => {
    localStorage.setItem("selectedGame", JSON.stringify(game));
    window.location.href = "product.html";
  });

  if (options.showRemove) {
    card.querySelector(".remove-btn").addEventListener("click", options.onRemove);
  }

  return card;
}

function renderOwned() {
  if (!ownedContainer) return;
  const owned = getStoredArray("ownedGames");
  ownedContainer.innerHTML = "";

  if (!owned.length) {
    ownedContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem;">No owned games yet. Complete a purchase from the cart.</p>`;
    return;
  }

  owned.forEach((game) => {
    const card = buildCard(game);
    ownedContainer.appendChild(card);
  });
}

function renderLibraryWishlist() {
  if (!wishlistLibContainer) return;
  const wishlist = getStoredArray("wishlist");
  wishlistLibContainer.innerHTML = "";

  if (!wishlist.length) {
    wishlistLibContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem;">Your wishlist is empty.</p>`;
    return;
  }

  wishlist.forEach((game) => {
    const card = buildCard(game, {
      showRemove: true,
      removeLabel: "Remove",
      onRemove: () => {
        const current = getStoredArray("wishlist");
        const updated = current.filter((g) => g.id !== game.id);
        setStoredArray("wishlist", updated);
        updateHeaderCounters();
        showToast(`${game.name} removed from wishlist`);
        renderLibraryWishlist();
      },
    });
    wishlistLibContainer.appendChild(card);
  });
}

function renderRecent() {
  if (!recentContainer) return;
  const recent = getStoredArray("recentGames");
  recentContainer.innerHTML = "";

  if (!recent.length) {
    recentContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem;">No recently viewed games.</p>`;
    return;
  }

  recent.forEach((game) => {
    const card = buildCard(game);
    recentContainer.appendChild(card);
  });
}

renderOwned();
renderLibraryWishlist();
renderRecent();
