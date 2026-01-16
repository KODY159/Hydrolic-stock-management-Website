// ========================================
// Calculator & Cart Functions (Customer Page)
// ❌ ห้ามใช้ import - ใช้ window.* แทน
// ========================================

// Global state
let cart = [];
let hosesData = [];
let fittingsData = [];

// ========================================
// INITIALIZATION
// ========================================

async function initCalculator() {
  console.log("🔄 Initializing calculator...");

  try {
    // ตรวจสอบว่า Firebase พร้อมหรือยัง
    if (typeof firebase === "undefined") {
      throw new Error("Firebase ยังไม่ถูกโหลด - กรุณารอสักครู่แล้วลอง refresh");
    }

    if (typeof db === "undefined") {
      throw new Error("Firebase Firestore ยังไม่พร้อม - เช็ค firebase.js");
    }

    if (typeof getAllDocs === "undefined") {
      throw new Error("getAllDocs function ไม่พบ - firebase.js ไม่ได้ export");
    }

    console.log("✅ Firebase is ready");

    // Show loading
    showLoading(true);

    // Set timeout 10 seconds
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "⏱️ Timeout: ใช้เวลานานเกินไป - เช็ค Internet หรือ Firestore Rules",
            ),
          ),
        10000,
      ),
    );

    // Load products from Firestore
    console.log("📥 Loading hoses...");
    const loadHosesPromise = getAllDocs("hoses");

    console.log("📥 Loading fittings...");
    const loadFittingsPromise = getAllDocs("fittings");

    // Race with timeout
    const results = await Promise.race([
      Promise.all([loadHosesPromise, loadFittingsPromise]),
      timeout,
    ]);

    hosesData = results[0];
    fittingsData = results[1];

    console.log("✅ Loaded hoses:", hosesData.length, "items");
    console.log("✅ Loaded fittings:", fittingsData.length, "items");

    // Check if we have data
    if (hosesData.length === 0 && fittingsData.length === 0) {
      showNoDataMessage();
      return;
    }

    // Populate dropdowns
    populateHoseSelects();
    populateFittingSelects();

    // Load cart from localStorage
    loadCartFromStorage();

    // Hide loading, show content
    showLoading(false);

    console.log("✅ Calculator initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing calculator:", error);
    showErrorMessage(error.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
  }
}

// ========================================
// UI HELPERS
// ========================================

function showLoading(show) {
  const loadingDiv = document.getElementById("loadingIndicator");
  const mainContent = document.getElementById("mainContent");

  if (show) {
    if (loadingDiv) loadingDiv.classList.remove("hidden");
    if (mainContent) mainContent.classList.add("hidden");
  } else {
    if (loadingDiv) loadingDiv.classList.add("hidden");
    if (mainContent) mainContent.classList.remove("hidden");
  }
}

function showErrorMessage(message) {
  const loadingDiv = document.getElementById("loadingIndicator");
  if (!loadingDiv) return;

  loadingDiv.innerHTML = `
    <div class="alert alert-danger">
      <span>❌</span>
      <div>
        <strong>เกิดข้อผิดพลาด</strong><br>
        ${message}
      </div>
    </div>
    <div style="margin-top: 1.5rem;">
      <p style="color: var(--text-light); margin-bottom: 1rem; font-weight: 600;">
        🔧 วิธีแก้ไข:
      </p>
      <ol style="text-align: left; color: var(--text-light); padding-left: 2rem; line-height: 1.8;">
        <li><strong>เปิด Console (F12)</strong> เพื่อดู error โดยละเอียด</li>
        <li>ตรวจสอบว่า <strong>ใส่ Firebase Config</strong> ใน firebase.js แล้ว</li>
        <li>ตรวจสอบ <strong>Firestore Rules</strong> ว่าอนุญาต read ไหม</li>
        <li>ตรวจสอบว่ามี<strong>ข้อมูลสินค้า</strong>ใน Firestore (ใช้ seed-data.html)</li>
        <li>ลอง <strong>Reload</strong> หน้าเว็บ (Ctrl+Shift+R)</li>
      </ol>
      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn btn-primary" onclick="location.reload()">
          🔄 Reload หน้าเว็บ
        </button>
        <a href="seed-data.html" class="btn btn-success">
          ➕ เพิ่มข้อมูลทดสอบ
        </a>
      </div>
    </div>
  `;
  loadingDiv.classList.remove("hidden");
}

function showNoDataMessage() {
  const loadingDiv = document.getElementById("loadingIndicator");
  if (!loadingDiv) return;

  loadingDiv.innerHTML = `
    <div class="alert alert-warning">
      <span>⚠️</span>
      <div>
        <strong>ยังไม่มีข้อมูลสินค้า</strong><br>
        กรุณาเพิ่มข้อมูลสายและหัวสายใน Firestore ก่อน
      </div>
    </div>
    <div style="margin-top: 1.5rem; text-align: left; color: var(--text-light);">
      <p style="font-weight: 600; margin-bottom: 1rem;">📝 วิธีเพิ่มข้อมูล:</p>
      <ol style="padding-left: 2rem; margin-top: 1rem; line-height: 1.8;">
        <li>คลิกปุ่ม "เพิ่มข้อมูลทดสอบ" ด้านล่าง</li>
        <li>กดปุ่ม "✨ เพิ่มข้อมูลทั้งหมด"</li>
        <li>รอจนกว่าจะเสร็จ</li>
        <li>กลับมาหน้านี้และ Reload</li>
      </ol>
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
        <a href="seed-data.html" class="btn btn-primary">
          ➕ เพิ่มข้อมูลทดสอบ
        </a>
        <button class="btn btn-secondary" onclick="location.reload()">
          🔄 Reload
        </button>
      </div>
    </div>
  `;
  loadingDiv.classList.remove("hidden");
}

// ========================================
// POPULATE DROPDOWNS
// ========================================

function populateHoseSelects() {
  const hoseTypeSelect = document.getElementById("hoseType");
  const hoseSizeSelect = document.getElementById("hoseSize");

  if (!hoseTypeSelect) return;

  // Get unique hose names
  const uniqueNames = [...new Set(hosesData.map((h) => h.name))];

  hoseTypeSelect.innerHTML = '<option value="">-- เลือกชนิดสาย --</option>';

  if (uniqueNames.length === 0) {
    hoseTypeSelect.innerHTML +=
      '<option value="" disabled>ยังไม่มีข้อมูลสาย</option>';
    return;
  }

  uniqueNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    hoseTypeSelect.appendChild(option);
  });

  // Clear size select
  hoseSizeSelect.innerHTML = '<option value="">-- เลือกขนาด --</option>';
}

function updateHoseSizes() {
  const selectedType = document.getElementById("hoseType").value;
  const hoseSizeSelect = document.getElementById("hoseSize");

  if (!selectedType) {
    hoseSizeSelect.innerHTML = '<option value="">-- เลือกขนาด --</option>';
    updateHosePrice();
    return;
  }

  // Filter hoses by selected type
  const sizes = hosesData.filter((h) => h.name === selectedType);

  hoseSizeSelect.innerHTML = '<option value="">-- เลือกขนาด --</option>';
  sizes.forEach((hose) => {
    const option = document.createElement("option");
    option.value = hose.id;
    option.textContent = `${hose.size} (${hose.stock} ม. คงเหลือ)`;
    option.dataset.price = hose.pricePerMeter;
    option.dataset.stock = hose.stock;
    hoseSizeSelect.appendChild(option);
  });

  updateHosePrice();
}

function populateFittingSelects() {
  const fittingTypeSelect = document.getElementById("fittingType");
  const fittingSizeSelect = document.getElementById("fittingSize");

  if (!fittingTypeSelect) return;

  // Get unique fitting names
  const uniqueNames = [...new Set(fittingsData.map((f) => f.name))];

  fittingTypeSelect.innerHTML = '<option value="">-- เลือกชนิดหัว --</option>';

  if (uniqueNames.length === 0) {
    fittingTypeSelect.innerHTML +=
      '<option value="" disabled>ยังไม่มีข้อมูลหัว</option>';
    return;
  }

  uniqueNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    fittingTypeSelect.appendChild(option);
  });

  // Clear size select
  fittingSizeSelect.innerHTML = '<option value="">-- เลือกขนาด --</option>';
}

function updateFittingSizes() {
  const selectedType = document.getElementById("fittingType").value;
  const fittingSizeSelect = document.getElementById("fittingSize");

  if (!selectedType) {
    fittingSizeSelect.innerHTML = '<option value="">-- เลือกขนาด --</option>';
    updateFittingPrice();
    return;
  }

  // Filter fittings by selected type
  const sizes = fittingsData.filter((f) => f.name === selectedType);

  fittingSizeSelect.innerHTML = '<option value="">-- เลือกขนาด --</option>';
  sizes.forEach((fitting) => {
    const option = document.createElement("option");
    option.value = fitting.id;
    option.textContent = `${fitting.size} - ${fitting.type} (${fitting.stock} ชิ้น คงเหลือ)`;
    option.dataset.price = fitting.pricePerUnit;
    option.dataset.stock = fitting.stock;
    fittingSizeSelect.appendChild(option);
  });

  updateFittingPrice();
}

// ========================================
// PRICE DISPLAY
// ========================================

function updateHosePrice() {
  const hoseSizeSelect = document.getElementById("hoseSize");
  const lengthInput = document.getElementById("hoseLength");
  const priceDisplay = document.getElementById("hosePricePerUnit");

  if (!hoseSizeSelect || !lengthInput || !priceDisplay) return;

  const selectedOption = hoseSizeSelect.options[hoseSizeSelect.selectedIndex];
  const price = parseFloat(selectedOption?.dataset?.price || 0);
  const length = parseFloat(lengthInput.value || 0);

  if (price > 0) {
    priceDisplay.value = `${price.toFixed(2)} บาท/ม. (รวม ${(price * length).toFixed(2)} บาท)`;
  } else {
    priceDisplay.value = "0.00 บาท";
  }
}

function updateFittingPrice() {
  const fittingSizeSelect = document.getElementById("fittingSize");
  const quantityInput = document.getElementById("fittingQuantity");
  const priceDisplay = document.getElementById("fittingPricePerUnit");

  if (!fittingSizeSelect || !quantityInput || !priceDisplay) return;

  const selectedOption =
    fittingSizeSelect.options[fittingSizeSelect.selectedIndex];
  const price = parseFloat(selectedOption?.dataset?.price || 0);
  const quantity = parseInt(quantityInput.value || 0);

  if (price > 0) {
    priceDisplay.value = `${price.toFixed(2)} บาท/ชิ้น (รวม ${(price * quantity).toFixed(2)} บาท)`;
  } else {
    priceDisplay.value = "0.00 บาท";
  }
}

// ========================================
// ADD TO CART
// ========================================

function addHoseToCart() {
  const hoseType = document.getElementById("hoseType").value;
  const hoseSizeSelect = document.getElementById("hoseSize");
  const length = parseFloat(document.getElementById("hoseLength").value);

  if (!hoseType || !hoseSizeSelect.value || !length || length <= 0) {
    showAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
    return;
  }

  const selectedOption = hoseSizeSelect.options[hoseSizeSelect.selectedIndex];
  const hoseId = hoseSizeSelect.value;
  const price = parseFloat(selectedOption.dataset.price);
  const stock = parseFloat(selectedOption.dataset.stock);
  const size = selectedOption.textContent.split("(")[0].trim();

  // Check stock
  if (length > stock) {
    showAlert(`สต๊อกไม่เพียงพอ (คงเหลือ ${stock} ม.)`, "danger");
    return;
  }

  // Add to cart
  const item = {
    id: Date.now(),
    productId: hoseId,
    type: "hose",
    name: hoseType,
    size: size,
    quantity: length,
    unit: "ม.",
    pricePerUnit: price,
    totalPrice: price * length,
  };

  cart.push(item);
  saveCartToStorage();
  updateCartDisplay();

  // Clear form
  document.getElementById("hoseLength").value = "";
  updateHosePrice();

  showAlert("เพิ่มสายลงตะกร้าแล้ว", "success");
}

function addFittingToCart() {
  const fittingType = document.getElementById("fittingType").value;
  const fittingSizeSelect = document.getElementById("fittingSize");
  const quantity = parseInt(document.getElementById("fittingQuantity").value);

  if (!fittingType || !fittingSizeSelect.value || !quantity || quantity <= 0) {
    showAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
    return;
  }

  const selectedOption =
    fittingSizeSelect.options[fittingSizeSelect.selectedIndex];
  const fittingId = fittingSizeSelect.value;
  const price = parseFloat(selectedOption.dataset.price);
  const stock = parseInt(selectedOption.dataset.stock);
  const sizeInfo = selectedOption.textContent.split("(")[0].trim();

  // Check stock
  if (quantity > stock) {
    showAlert(`สต๊อกไม่เพียงพอ (คงเหลือ ${stock} ชิ้น)`, "danger");
    return;
  }

  // Add to cart
  const item = {
    id: Date.now(),
    productId: fittingId,
    type: "fitting",
    name: fittingType,
    size: sizeInfo,
    quantity: quantity,
    unit: "ชิ้น",
    pricePerUnit: price,
    totalPrice: price * quantity,
  };

  cart.push(item);
  saveCartToStorage();
  updateCartDisplay();

  // Clear form
  document.getElementById("fittingQuantity").value = "";
  updateFittingPrice();

  showAlert("เพิ่มหัวลงตะกร้าแล้ว", "success");
}

// ========================================
// CART DISPLAY
// ========================================

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartSummary = document.getElementById("cartSummary");

  if (!cartItemsDiv) return;

  // Update count
  cartCount.textContent = `${cart.length} รายการ`;

  // Show/hide summary
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="text-center" style="padding: 3rem; color: var(--text-light);">
        <p style="font-size: 1.125rem;">🛍️ ยังไม่มีสินค้าในตะกร้า</p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">
          เลือกสินค้าด้านบนเพื่อเริ่มต้น
        </p>
      </div>
    `;
    cartSummary.classList.add("hidden");
    return;
  }

  cartSummary.classList.remove("hidden");

  // Display cart items
  cartItemsDiv.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">
          ${item.type === "hose" ? "📏" : "🔩"} ${item.name}
        </div>
        <div class="cart-item-details">
          ${item.size} × ${item.quantity} ${item.unit} @ ${item.pricePerUnit.toFixed(2)} บาท/${item.unit}
        </div>
      </div>
      <div class="cart-item-price">
        ${item.totalPrice.toFixed(2)} ฿
      </div>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
        🗑️
      </button>
    </div>
  `,
    )
    .join("");

  // Update summary
  updateCartSummary();
}

function updateCartSummary() {
  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = 0;
  const netPrice = totalPrice - discount;

  document.getElementById("totalPrice").textContent =
    `${totalPrice.toFixed(2)} บาท`;
  document.getElementById("discount").textContent =
    `${discount.toFixed(2)} บาท`;
  document.getElementById("netPrice").textContent =
    `${netPrice.toFixed(2)} บาท`;
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCartToStorage();
  updateCartDisplay();
  showAlert("ลบสินค้าออกจากตะกร้าแล้ว", "success");
}

function clearAll() {
  if (cart.length === 0) return;

  if (confirm("คุณต้องการล้างตะกร้าสินค้าทั้งหมดหรือไม่?")) {
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    showAlert("ล้างตะกร้าสินค้าแล้ว", "success");
  }
}

// ========================================
// SAVE ORDER
// ========================================

async function saveOrder() {
  if (cart.length === 0) {
    showAlert("ไม่มีสินค้าในตะกร้า", "warning");
    return;
  }

  try {
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const receiptNumber = generateReceiptNumber();

    const orderData = {
      receiptNumber: receiptNumber,
      items: cart,
      totalPrice: totalPrice,
      discount: 0,
      netPrice: totalPrice,
      status: "completed",
    };

    // Save to Firestore
    const result = await addDoc("orders", orderData);

    if (result.success) {
      // Update stock
      for (const item of cart) {
        const collection = item.type === "hose" ? "hoses" : "fittings";
        await updateStock(collection, item.productId, -item.quantity);
      }

      showAlert("บันทึกรายการสำเร็จ", "success");

      // Clear cart after 1 second
      setTimeout(() => {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
      }, 1000);

      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error saving order:", error);
    showAlert("ไม่สามารถบันทึกรายการได้: " + error.message, "danger");
  }
}

// ========================================
// LOCAL STORAGE
// ========================================

function saveCartToStorage() {
  try {
    localStorage.setItem("hydraulic_cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("hydraulic_cart");
    if (saved) {
      cart = JSON.parse(saved);
      updateCartDisplay();
    }
  } catch (error) {
    console.error("Error loading cart:", error);
    cart = [];
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function generateReceiptNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `RC${year}${month}${day}${random}`;
}

function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    animation: slideIn 0.3s ease;
  `;
  alertDiv.innerHTML = `
    <span>${type === "success" ? "✅" : type === "warning" ? "⚠️" : "❌"}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// ========================================
// EVENT LISTENERS & INITIALIZATION
// ========================================

if (typeof window !== "undefined") {
  window.addHoseToCart = addHoseToCart;
  window.addFittingToCart = addFittingToCart;
  window.removeFromCart = removeFromCart;
  window.clearAll = clearAll;
  window.saveOrder = saveOrder;
  window.updateHosePrice = updateHosePrice;
  window.updateFittingPrice = updateFittingPrice;
  window.updateHoseSizes = updateHoseSizes;
  window.updateFittingSizes = updateFittingSizes;

  // Auto-init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalculator);
  } else {
    initCalculator();
  }
}
