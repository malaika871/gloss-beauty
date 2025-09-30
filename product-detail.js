// Get product ID from URL
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  document.getElementById("cart-count").textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

function renderProductDetail(product) {
  let currentImg = 0;
  const hasVideo = product.videos && product.videos.length > 0;
  const totalMedia = product.images.length + (hasVideo ? 1 : 0);
  const container = document.getElementById("product-detail");
  container.innerHTML = `
    <div class="product-detail-page">
      <div class="product-images">
        <div id="main-media-container" class="main-media-container">
          <img id="main-product-img" src="${product.images[0]}" alt="${
    product.name
  }" class="main-product-img">
          ${
            hasVideo
              ? `<video id="main-product-video" src="${product.videos[0]}" controls class="main-product-video"></video>`
              : ""
          }
        </div>
        <div class="img-nav-row">
          <button id="prev-img" aria-label="Previous image">&#8592;</button>
          <span id="img-indicator" class="img-indicator">${
            currentImg + 1
          } / ${totalMedia}</span>
          <button id="next-img" aria-label="Next image">&#8594;</button>
        </div>
        <div class="media-thumbnails">
          ${product.images
            .map(
              (img, i) =>
                `<img src="${img}" alt="${
                  product.name
                }" data-idx="${i}" class="media-thumb ${
                  i === 0 ? "active" : ""
                }">`
            )
            .join("")}
          ${
            hasVideo
              ? `<div data-idx="${totalMedia - 1}" class="video-thumb${
                  currentImg === totalMedia - 1 ? " active" : ""
                }"><svg width="28" height="28" viewBox="0 0 24 24" fill="#c2185b"><path d="M8 5v14l11-7z"/></svg></div>`
              : ""
          }
        </div>
      </div>
      <div class="product-info-detail">
        <h1>${product.name}</h1>
        <div class="price product-price-detail">${product.price}</div>
        <h3 class="product-description-title">Description</h3>
        <p class="product-description-text">${product.description}</p>
        <ul class="product-details-list">
          <li><strong>Category:</strong> ${product.category}</li>
          <li><strong>Status:</strong> ${
            product.status.charAt(0).toUpperCase() + product.status.slice(1)
          }</li>
        </ul>
        <div class="quantity-controls">
          <label for="quantity" class="quantity-label">Quantity:</label>
          <button id="qty-minus" type="button" aria-label="Decrease quantity" class="qty-btn">-</button>
          <input type="number" id="quantity" min="1" value="1" placeholder="Enter quantity">
          <button id="qty-plus" type="button" aria-label="Increase quantity" class="qty-btn">+</button>
        </div>
        <div class="quantity-help-text">Please enter the quantity you want to purchase.</div>
        <button id="add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;
  // Image/video navigation
  const mainImg = document.getElementById("main-product-img");
  const mainVideo = document.getElementById("main-product-video");
  const imgIndicator = document.getElementById("img-indicator");
  function highlightThumb(idx) {
    Array.from(
      container.querySelectorAll(".media-thumb, .video-thumb")
    ).forEach((thumb, i) => {
      thumb.classList.toggle("active", i === idx);
    });
  }
  function showMedia(idx) {
    if (idx < product.images.length) {
      if (mainImg) {
        mainImg.style.display = "block";
        mainImg.src = product.images[idx];
      }
      if (mainVideo) mainVideo.style.display = "none";
    } else if (hasVideo && idx === totalMedia - 1) {
      if (mainImg) mainImg.style.display = "none";
      if (mainVideo) mainVideo.style.display = "block";
    }
    imgIndicator.textContent = `${idx + 1} / ${totalMedia}`;
    highlightThumb(idx);
  }
  document.getElementById("prev-img").onclick = () => {
    currentImg = (currentImg - 1 + totalMedia) % totalMedia;
    showMedia(currentImg);
  };
  document.getElementById("next-img").onclick = () => {
    currentImg = (currentImg + 1) % totalMedia;
    showMedia(currentImg);
  };
  // Thumbnail click
  Array.from(container.querySelectorAll(".media-thumb")).forEach((thumb, i) => {
    thumb.onclick = () => {
      currentImg = i;
      showMedia(currentImg);
    };
  });
  // Add to cart
  document.getElementById("add-to-cart").onclick = () => {
    const qty = parseInt(document.getElementById("quantity").value, 10) || 1;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: product.id, quantity: qty });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart!");
  };
  // After rendering, add event listeners for plus/minus buttons
  setTimeout(() => {
    const qtyInput = document.getElementById("quantity");
    document.getElementById("qty-minus").onclick = () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1 || 1);
    };
    document.getElementById("qty-plus").onclick = () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) + 1 || 1);
    };
  }, 0);
  // Show initial media
  showMedia(currentImg);
}

window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  const id = getProductIdFromUrl();
  const product = products.find((p) => p.id === id);
  if (!product) {
    document.getElementById("product-detail").innerHTML =
      "<p>Product not found.</p>";
    return;
  }
  renderProductDetail(product);
});
