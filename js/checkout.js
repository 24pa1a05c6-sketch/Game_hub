// checkout.js

const completeCheckoutBtn = document.getElementById("complete-checkout");

if (completeCheckoutBtn) {
  completeCheckoutBtn.addEventListener("click", () => {
    const cart = getStoredArray("cart");
    if (!cart.length) {
      showToast("No items in cart");
      return;
    }

    const owned = getStoredArray("ownedGames");
    const newOwned = [...owned];

    cart.forEach((game) => {
      if (!newOwned.some((g) => g.id === game.id)) {
        newOwned.push(game);
      }
    });

    setStoredArray("ownedGames", newOwned);
    setStoredArray("cart", []);
    updateHeaderCounters();
    showToast("Purchase complete (demo) – games added to your library");
    setTimeout(() => {
      window.location.href = "library.html";
    }, 900);
  });
}
