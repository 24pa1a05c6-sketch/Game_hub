// header.js

// Grab header counters if present
const cartCount = document.getElementById("cart-count");
const wishlistCount = document.getElementById("wishlist-count");

/** ---------- Storage helpers ---------- **/

function getStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading from localStorage:", key, err);
    return [];
  }
}

function setStoredArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error writing to localStorage:", key, err);
  }
}

/** ---------- Toast notification ---------- **/

function showToast(message) {
  let toast = document.querySelector(".gh-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "gh-toast";
    toast.style.position = "fixed";
    toast.style.right = "16px";
    toast.style.bottom = "16px";
    toast.style.zIndex = "9999";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "999px";
    toast.style.background = "rgba(5, 7, 20, 0.96)";
    toast.style.border = "1px solid rgba(149, 177, 255, 0.9)";
    toast.style.color = "#f9fafb";
    toast.style.fontSize = "0.8rem";
    toast.style.boxShadow = "0 18px 40px rgba(0, 0, 0, 0.9)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "opacity 0.18s ease, transform 0.18s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  clearTimeout(window.__ghToastTimeout);
  window.__ghToastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 1800);
}

/** ---------- Header counters ---------- **/

function updateHeaderCounters() {
  const cart = getStoredArray("cart");
  const wishlist = getStoredArray("wishlist");

  if (cartCount) cartCount.textContent = cart.length;
  if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

updateHeaderCounters();
