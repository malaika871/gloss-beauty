// Load products from products.js
// This script handles rendering products and upcoming products

// Update cart count in navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) {
    cartCountElem.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }
}

// Render product cards
function renderProducts(list, products) {
  list.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => {
      window.location.href = `product.html?id=${product.id}`;
    };
    card.innerHTML = `
      <img src="${
        product.images[0] ||
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
      }" alt="${product.name}">
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.category}</p>
        <div class="price">${product.price}</div>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderUpcomingProducts(list, products) {
  list.innerHTML = "";
  if (products.length === 0) {
    list.innerHTML = '<p class="no-upcoming-products">No upcoming products at the moment.</p>';
    return;
  }
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "product-card" + (product.status === "upcoming" ? " upcoming" : "");
    card.innerHTML = `
      <img src="${
        product.images[0] ||
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
      }" alt="${product.name}">
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.category}</p>
        <div class="price">${product.price}</div>
        <p class="coming-soon-badge">Coming Soon</p>
      </div>
    `;
    list.appendChild(card);
  });
}

// Hamburger menu logic for all pages
function setupHamburgerMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  function updateNavLinksDisplay() {
    if (!navLinks) return;
    if (window.innerWidth > 900) {
      navLinks.classList.add("open");
      if (navToggle) navToggle.style.display = "none";
    } else {
      navLinks.classList.remove("open");
      if (navToggle) navToggle.style.display = "";
    }
    if (window.innerWidth <= 900) navLinks.classList.remove("open");
  }
  updateNavLinksDisplay();
  window.addEventListener("resize", updateNavLinksDisplay);
  if (navToggle && navLinks) {
    navToggle.onclick = function () {
      navLinks.classList.toggle("open");
    };
  }
}

// Run hamburger menu setup on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupHamburgerMenu);
} else {
  setupHamburgerMenu();
}

// Page logic
window.addEventListener("DOMContentLoaded", () => {
  updateCartCount(); // Always update cart count on page load
  if (typeof products === "undefined") return;
  // Home page
  if (document.getElementById("product-list")) {
    renderProducts(
      document.getElementById("product-list"),
      products.filter((p) => p.status === "available")
    );
  }
  // Upcoming products page
  if (document.getElementById("upcoming-products-list")) {
    renderUpcomingProducts(
      document.getElementById("upcoming-products-list"),
      products.filter((p) => p.status === "upcoming")
    );
  }
});
