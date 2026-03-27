// cart.js

const cartContainer = document.getElementById("cart-container");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

function renderCart() {
  if (!cartContainer) return;

  const cart = getStoredArray("cart");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML =
      `<p style="color:#a5afc7; font-size:0.9rem;">Your cart is empty.</p>`;
    if (cartTotal) cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((game, index) => {
    total += game.price;

    const item = document.createElement("div");
    item.classList.add("cart-item");

    item.innerHTML = `
      <img src="${game.img}" alt="${game.name}" onerror="this.onerror=null; this.src='https://placehold.co/300x400/121427/8f9bb7?text=Cover+Not+Found';">
      <div class="cart-info">
        <h3>${game.name}</h3>
        <p>${game.category}</p>
        <div class="price">$${game.price.toFixed(2)}</div>
        <button class="remove-btn">Remove</button>
      </div>
    `;

    item.querySelector(".remove-btn").addEventListener("click", () => {
      const current = getStoredArray("cart");
      current.splice(index, 1);
      setStoredArray("cart", current);
      updateHeaderCounters();
      showToast(`${game.name} removed from cart`);
      renderCart();
    });

    cartContainer.appendChild(item);
  });

  if (cartTotal) {
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const cart = getStoredArray("cart");
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }
    window.location.href = "checkout.html";
  });
}

renderCart();
