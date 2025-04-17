// Sample product data
const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 99.99,
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 199.99,
    description:
      "Feature-packed smartwatch with health monitoring and notifications.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
  },
  {
    id: 3,
    title: "Bluetooth Speaker",
    price: 79.99,
    description:
      "Portable waterproof speaker with 20W output and 15-hour playtime.",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1489&q=80",
  },
  {
    id: 4,
    title: "Laptop Backpack",
    price: 49.99,
    description:
      "Durable backpack with USB charging port and anti-theft design.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
  },
  {
    id: 5,
    title: "Wireless Earbuds",
    price: 129.99,
    description:
      "True wireless earbuds with active noise cancellation and touch controls.",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
  },
  {
    id: 6,
    title: "Fitness Tracker",
    price: 59.99,
    description:
      "Waterproof fitness tracker with heart rate monitor and sleep tracking.",
    image:
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

// DOM Elements
const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.querySelector(".cart-count");
const cartModal = document.getElementById("cart-modal");
const overlay = document.getElementById("overlay");
const cartToggle = document.getElementById("cart-toggle");
const closeCart = document.getElementById("close-cart");

// Cart state
let cart = [];

// Initialize the app
function init() {
  renderProducts();
  setupEventListeners();
}

// Render products to the page
function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
          <div class="product-img">
              <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="product-info">
              <h3 class="product-title">${product.title}</h3>
              <p class="product-price">$${product.price.toFixed(2)}</p>
              <p class="product-description">${product.description}</p>
              <button class="add-to-cart" data-id="${
                product.id
              }">Add to Cart</button>
          </div>
      `;
    productGrid.appendChild(productCard);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Add to cart buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = parseInt(e.target.getAttribute("data-id"));
      addToCart(productId);
    }

    // Remove item from cart
    if (e.target.classList.contains("cart-item-remove")) {
      const productId = parseInt(e.target.getAttribute("data-id"));
      removeFromCart(productId);
    }
  });

  // Cart toggle
  cartToggle.addEventListener("click", toggleCart);
  closeCart.addEventListener("click", toggleCart);
  overlay.addEventListener("click", toggleCart);
}

// Add item to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  showAddToCartFeedback();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Update cart UI
function updateCart() {
  // Update cart items
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
              <h4 class="cart-item-title">${item.title}</h4>
              <p class="cart-item-price">$${(
                item.price * item.quantity
              ).toFixed(2)}</p>
              <p>Qty: ${item.quantity}</p>
              <button class="cart-item-remove" data-id="${
                item.id
              }">Remove</button>
          </div>
      `;
    cartItems.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  // Update total
  cartTotal.textContent = total.toFixed(2);

  // Update cart count
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

// Toggle cart visibility
function toggleCart() {
  cartModal.classList.toggle("open");
  overlay.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
}

// Show feedback when item is added to cart
function showAddToCartFeedback() {
  const feedback = document.createElement("div");
  feedback.className = "add-to-cart-feedback";
  feedback.textContent = "Item added to cart!";
  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
  }, 2000);
}

// Initialize the app
init();
