function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  document.getElementById("cart-count").textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const itemsDiv = document.getElementById("cart-items");
  if (!cart.length) {
    itemsDiv.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    document.getElementById("cart-total").textContent = "";
    updateCartCount();
    return;
  }
  let total = 0;
  itemsDiv.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";
      const price = parseFloat(product.price.replace(/[^\d.]/g, ""));
      total += price * item.quantity;
      return `
      <div class="cart-item">
        <img src="${product.images[0]}" alt="${product.name}">
        <div class="cart-item-info">
          <h2>${product.name}</h2>
          <div class="price">${product.price}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${item.id}" data-action="decrement" aria-label="Decrease quantity">-</button>
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="cart-qty">
          <button class="qty-btn" data-id="${item.id}" data-action="increment" aria-label="Increase quantity">+</button>
        </div>
        <button data-id="${item.id}" class="remove-cart">Remove</button>
      </div>
    `;
    })
    .join("");
  document.getElementById("cart-total").textContent = `Total: $${total.toFixed(
    2
  )}`;
  updateCartCount();
  // Quantity change
  Array.from(document.getElementsByClassName("cart-qty")).forEach((input) => {
    input.onchange = () => {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const item = cart.find(
        (i) => i.id === parseInt(input.getAttribute("data-id"), 10)
      );
      if (item) {
        item.quantity = Math.max(1, parseInt(input.value, 10) || 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    };
  });
  // Plus/minus buttons
  Array.from(document.getElementsByClassName("qty-btn")).forEach((btn) => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute("data-id"), 10);
      const action = btn.getAttribute("data-action");
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const item = cart.find((i) => i.id === id);
      if (item) {
        if (action === "increment") {
          item.quantity += 1;
        } else if (action === "decrement") {
          item.quantity = Math.max(1, item.quantity - 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    };
  });
  // Remove
  Array.from(document.getElementsByClassName("remove-cart")).forEach((btn) => {
    btn.onclick = () => {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart = cart.filter(
        (i) => i.id !== parseInt(btn.getAttribute("data-id"), 10)
      );
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    };
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
