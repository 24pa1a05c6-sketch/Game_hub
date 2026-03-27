// shop.js

const gamesContainer = document.getElementById("games-container");
const searchBarShop = document.getElementById("search-bar");
const filterChips = document.querySelectorAll(".filter-chip"); // top filters
const sidePills = document.querySelectorAll(".side-pill"); // sidebar: top/new/deals
const sideChips = document.querySelectorAll(".side-chip"); // sidebar: RPG/Action/FPS...

let activeCategory = "all";
let activeMode = "top"; // "top", "new", "deals"

function matchesCategory(game, category) {
  if (category === "all") return true;
  if (category === "Free") return game.price === 0;
  return game.category === category;
}

function applyModeSort(list) {
  const arr = [...list];

  if (activeMode === "top") {
    arr.sort((a, b) => {
      if (b.rating === a.rating) return b.price - a.price;
      return b.rating - a.rating;
    });
  } else if (activeMode === "new") {
    arr.sort((a, b) => b.id - a.id);
  } else if (activeMode === "deals") {
    const onSale = arr.filter((g) => g.sale);
    onSale.sort((a, b) => (b.original - b.price) - (a.original - a.price));
    return onSale;
  }

  return arr;
}

function renderGames(filter = "") {
  if (!gamesContainer) return;

  gamesContainer.innerHTML = "";
  const query = filter.trim().toLowerCase();

  let filtered = games.filter((game) => {
    const matchesText =
      !query ||
      game.name.toLowerCase().includes(query) ||
      game.category.toLowerCase().includes(query);
    const matchesCat = matchesCategory(game, activeCategory);
    return matchesText && matchesCat;
  });

  filtered = applyModeSort(filtered);

  if (filtered.length === 0) {
    gamesContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem; padding:6px 2px;">No games match these filters.</p>`;
    return;
  }

  filtered.forEach((game) => {
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

    gamesContainer.appendChild(card);
  });
}

// Initial render
renderGames();

// Search
if (searchBarShop) {
  searchBarShop.addEventListener("input", (e) => renderGames(e.target.value));
}

// top filter chips (All / RPG / FPS ... )
if (filterChips.length) {
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const label = chip.dataset.category || chip.textContent.trim();
      activeCategory = label === "Free to play" ? "Free" : label;

      // clear sidebar chips active state when top is used
      sideChips.forEach((c) => c.classList.remove("active"));

      renderGames(searchBarShop ? searchBarShop.value : "");
    });
  });

  const allChip = document.querySelector('.filter-chip[data-category="all"]');
  if (allChip) allChip.classList.add("active");
}

// sidebar mode pills (Top sellers / New & trending / Deals)
if (sidePills.length) {
  sidePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      sidePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeMode = pill.dataset.mode;
      renderGames(searchBarShop ? searchBarShop.value : "");
    });
  });

  const defaultPill = document.querySelector('.side-pill[data-mode="top"]');
  if (defaultPill) defaultPill.classList.add("active");
}

// sidebar filter chips (RPG / Action / FPS / Open World / Free to play)
if (sideChips.length) {
  sideChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      sideChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const label = chip.dataset.category || chip.textContent.trim();
      activeCategory = label === "Free to play" ? "Free" : label;

      // reset top chips (set All active so both don't conflict)
      filterChips.forEach((c) => c.classList.remove("active"));
      const allChipTop = document.querySelector('.filter-chip[data-category="all"]');
      if (allChipTop) allChipTop.classList.add("active");

      renderGames(searchBarShop ? searchBarShop.value : "");
    });
  });
}
