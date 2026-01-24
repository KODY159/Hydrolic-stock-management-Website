// ========================================
// Inventory Management Functions (Admin)
// ========================================

// Global state - Export to window
let hosesData = [];
let fittingsData = [];
let ordersData = [];

// Export to window immediately
if (typeof window !== "undefined") {
  window.hosesData = hosesData;
  window.fittingsData = fittingsData;
  window.ordersData = ordersData;
}

// ========================================
// HOSE MANAGEMENT
// ========================================

// Load all hoses from Firestore
async function loadHoses() {
  try {
    hosesData = await getAllDocs("hoses");
    displayHosesTable();
    updateDashboardStats();
    return hosesData;
  } catch (error) {
    console.error("Error loading hoses:", error);
    showNotification("ไม่สามารถโหลดข้อมูลสายได้", "danger");
    return [];
  }
}

// Display hoses in table
// function displayHosesTable() {
//   const tbody = document.getElementById("hoseTableBody");
//   if (!tbody) return;

//   if (hosesData.length === 0) {
//     tbody.innerHTML = `
//       <tr>
//         <td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-light);">
//           ยังไม่มีข้อมูลสาย กรุณาเพิ่มสายใหม่
//         </td>
//       </tr>
//     `;
//     return;
//   }

//   tbody.innerHTML = hosesData
//     .map((hose) => {
//       const stockStatus = getStockStatus(hose.stock, "hose");
//       return `
//       <tr>
//         <td><strong>${hose.name}</strong></td>
//         <td>${hose.size}</td>
//         <td>${formatCurrency(hose.pricePerMeter)}</td>
//         <td>${hose.stock} ม.</td>
//         <td><span class="badge badge-${stockStatus.class}">${stockStatus.label}</span></td>
//         <td style="text-align: center;">
//           <div class="action-buttons">
//             <button class="btn btn-sm btn-primary" onclick="editHose('${hose.id}')">
//               ✏️
//             </button>
//             <button class="btn btn-sm btn-danger" onclick="deleteHose('${hose.id}')">
//               🗑️
//             </button>
//           </div>
//         </td>
//       </tr>
//     `;
//     })
//     .join("");
// }
function displayHosesTable() {
  const tbody = document.getElementById("hoseTableBody");
  if (!tbody) return;

  if (hosesData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-light);">
          ยังไม่มีข้อมูลสาย กรุณาเพิ่มสายใหม่
        </td>
      </tr>
    `;
    return;
  }

  // Group by name
  const grouped = {};
  hosesData.forEach((hose) => {
    if (!grouped[hose.name]) grouped[hose.name] = [];
    grouped[hose.name].push(hose);
  });

  // Sort within each group by size (simple alphanumeric)
  Object.keys(grouped).forEach((name) => {
    grouped[name].sort((a, b) =>
      a.size.localeCompare(b.size, undefined, { numeric: true }),
    );
  });

  // Flatten grouped array for display
  const sortedHoses = Object.keys(grouped)
    .sort() // sort group names alphabetically
    .flatMap((name) => grouped[name]);

  tbody.innerHTML = sortedHoses
    .map((hose) => {
      const stockStatus = getStockStatus(hose.stock, "hose");
      return `
      <tr>
        <td><strong>${hose.name}</strong></td>
        <td>${hose.size}</td>
        <td>${formatCurrency(hose.pricePerMeter)}</td>
        <td>${hose.stock} ม.</td>
        <td><span class="badge badge-${stockStatus.class}">${stockStatus.label}</span></td>
        <td style="text-align: center;">
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" onclick="editHose('${hose.id}')">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="deleteHoseData('${hose.id}')">🗑️</button>
          </div>
        </td>
      </tr>
      `;
    })
    .join("");
}

// Add new hose
async function addHose(data) {
  try {
    const result = await addDoc("hoses", {
      name: data.name,
      size: data.size,
      pricePerMeter: parseFloat(data.pricePerMeter),
      stock: parseFloat(data.stock),
      category: data.category || "standard",
      description: data.description || "",
    });

    if (result.success) {
      showNotification("เพิ่มสายสำเร็จ", "success");
      await loadHoses();
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error adding hose:", error);
    showNotification("ไม่สามารถเพิ่มสายได้", "danger");
    return { success: false, error: error.message };
  }
}

// Update hose
async function updateHoseData(id, data) {
  try {
    const result = await updateDoc("hoses", id, {
      name: data.name,
      size: data.size,
      pricePerMeter: parseFloat(data.pricePerMeter),
      stock: parseFloat(data.stock),
      category: data.category || "standard",
      description: data.description || "",
    });

    if (result.success) {
      showNotification("อัปเดตข้อมูลสายสำเร็จ", "success");
      await loadHoses();
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error updating hose:", error);
    showNotification("ไม่สามารถอัปเดตข้อมูลสายได้", "danger");
    return { success: false, error: error.message };
  }
}

// Delete hose
async function deleteHoseData(id) {
  try {
    const result = await deleteDoc("hoses", id);

    if (result.success) {
      showNotification("ลบสายสำเร็จ", "success");
      await loadHoses();
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error deleting hose:", error);
    showNotification("ไม่สามารถลบสายได้", "danger");
    return { success: false, error: error.message };
  }
}

// ========================================
// FITTING MANAGEMENT
// ========================================

// Load all fittings
async function loadFittings() {
  try {
    fittingsData = await getAllDocs("fittings");
    displayFittingsTable();
    updateDashboardStats();
    return fittingsData;
  } catch (error) {
    console.error("Error loading fittings:", error);
    showNotification("ไม่สามารถโหลดข้อมูลหัวสายได้", "danger");
    return [];
  }
}

// Display fittings in table
// function displayFittingsTable() {
//   const tbody = document.getElementById("fittingTableBody");
//   if (!tbody) return;

//   if (fittingsData.length === 0) {
//     tbody.innerHTML = `
//       <tr>
//         <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-light);">
//           ยังไม่มีข้อมูลหัวสาย กรุณาเพิ่มหัวสายใหม่
//         </td>
//       </tr>
//     `;
//     return;
//   }

//   tbody.innerHTML = fittingsData
//     .map((fitting) => {
//       const stockStatus = getStockStatus(fitting.stock, "fitting");
//       return `
//       <tr>
//         <td><strong>${fitting.name}</strong></td>
//         <td>${fitting.type}</td>
//         <td>${fitting.size}</td>
//         <td>${formatCurrency(fitting.pricePerUnit)}</td>
//         <td>${fitting.stock} ชิ้น</td>
//         <td><span class="badge badge-${stockStatus.class}">${stockStatus.label}</span></td>
//         <td style="text-align: center;">
//           <div class="action-buttons">
//             <button class="btn btn-sm btn-primary" onclick="editFitting('${fitting.id}')">
//               ✏️
//             </button>
//             <button class="btn btn-sm btn-danger" onclick="deleteFitting('${fitting.id}')">
//               🗑️
//             </button>
//           </div>
//         </td>
//       </tr>
//     `;
//     })
//     .join("");
// }
function displayFittingsTable() {
  const tbody = document.getElementById("fittingTableBody");
  if (!tbody) return;

  if (fittingsData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-light);">
          ยังไม่มีข้อมูลหัวสาย กรุณาเพิ่มหัวสายใหม่
        </td>
      </tr>
    `;
    return;
  }

  // Group by name
  const grouped = {};
  fittingsData.forEach((fitting) => {
    if (!grouped[fitting.name]) grouped[fitting.name] = [];
    grouped[fitting.name].push(fitting);
  });

  // Sort within each group by size
  Object.keys(grouped).forEach((name) => {
    grouped[name].sort((a, b) =>
      a.size.localeCompare(b.size, undefined, { numeric: true }),
    );
  });

  // Flatten grouped array
  const sortedFittings = Object.keys(grouped)
    .sort() // sort group names alphabetically
    .flatMap((name) => grouped[name]);

  tbody.innerHTML = sortedFittings
    .map((fitting) => {
      const stockStatus = getStockStatus(fitting.stock, "fitting");
      return `
      <tr>
        <td><strong>${fitting.name}</strong></td>
        <td>${fitting.type}</td>
        <td>${fitting.size}</td>
        <td>${formatCurrency(fitting.pricePerUnit)}</td>
        <td>${fitting.stock} ชิ้น</td>
        <td><span class="badge badge-${stockStatus.class}">${stockStatus.label}</span></td>
        <td style="text-align: center;">
          <div class="action-buttons">
            <button class="btn btn-sm btn-primary" onclick="editFitting('${fitting.id}')">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="deleteFittingData('${fitting.id}')">🗑️</button>
          </div>
        </td>
      </tr>
      `;
    })
    .join("");
}

// Add new fitting
async function addFittingData(data) {
  try {
    const result = await addDoc("fittings", {
      name: data.name,
      type: data.type,
      size: data.size,
      pricePerUnit: parseFloat(data.pricePerUnit),
      stock: parseInt(data.stock),
      description: data.description || "",
    });

    if (result.success) {
      showNotification("เพิ่มหัวสายสำเร็จ", "success");
      await loadFittings();
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error adding fitting:", error);
    showNotification("ไม่สามารถเพิ่มหัวสายได้", "danger");
    return { success: false, error: error.message };
  }
}

// Update fitting
async function updateFittingData(id, data) {
  try {
    const result = await updateDoc("fittings", id, {
      name: data.name,
      type: data.type,
      size: data.size,
      pricePerUnit: parseFloat(data.pricePerUnit),
      stock: parseInt(data.stock),
      description: data.description || "",
    });

    if (result.success) {
      showNotification("อัปเดตข้อมูลหัวสายสำเร็จ", "success");
      await loadFittings();
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error updating fitting:", error);
    showNotification("ไม่สามารถอัปเดตข้อมูลหัวสายได้", "danger");
    return { success: false, error: error.message };
  }
}

// Delete fitting
async function deleteFittingData(id) {
  try {
    const result = await deleteDoc("fittings", id);

    if (result.success) {
      showNotification("ลบหัวสายสำเร็จ", "success");
      await loadFittings();
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error deleting fitting:", error);
    showNotification("ไม่สามารถลบหัวสายได้", "danger");
    return { success: false, error: error.message };
  }
}

// ========================================
// ORDER MANAGEMENT
// ========================================

// Load orders
async function loadOrders() {
  try {
    ordersData = await getAllDocs("orders");
    // Sort by date descending
    ordersData.sort((a, b) => {
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return dateB - dateA;
    });
    displayOrdersTable();
    updateDashboardStats();
    return ordersData;
  } catch (error) {
    console.error("Error loading orders:", error);
    showNotification("ไม่สามารถโหลดข้อมูลรายการขายได้", "danger");
    return [];
  }
}

// Display orders in table
function displayOrdersTable() {
  const tbody = document.getElementById("orderTableBody");
  if (!tbody) return;

  if (ordersData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center" style="padding: 2rem; color: var(--text-light);">
          ยังไม่มีรายการขาย
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = ordersData
    .map((order) => {
      const date = order.createdAt?.toDate()
        ? formatDateTime(order.createdAt.toDate())
        : "N/A";
      const itemCount = order.items?.length || 0;

      return `
      <tr>
        <td><strong>${order.receiptNumber || "N/A"}</strong></td>
        <td>${date}</td>
        <td>${itemCount} รายการ</td>
        <td><strong>${formatCurrency(order.totalPrice)}</strong></td>
        <td style="text-align: center;">
          <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">
            👁️ ดู
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// ========================================
// DASHBOARD STATS
// ========================================

function updateDashboardStats() {
  // Total hose types
  const totalHoses = document.getElementById("totalHoseTypes");
  if (totalHoses) totalHoses.textContent = hosesData.length;

  // Total fitting types
  const totalFittings = document.getElementById("totalFittingTypes");
  if (totalFittings) totalFittings.textContent = fittingsData.length;

  // Today's sales
  const todaySales = document.getElementById("todaySales");
  if (todaySales) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = ordersData.filter((order) => {
      const orderDate = order.createdAt?.toDate() || new Date(0);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const total = todayOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );
    todaySales.textContent = formatCurrency(total);
  }

  // Low stock count
  const lowStock = document.getElementById("lowStock");
  if (lowStock) {
    const lowStockHoses = hosesData.filter((h) => h.stock < 20).length;
    const lowStockFittings = fittingsData.filter((f) => f.stock < 10).length;
    lowStock.textContent = lowStockHoses + lowStockFittings;
  }
}

// ========================================
// EXPORT TO EXCEL
// ========================================

function exportToExcel() {
  if (ordersData.length === 0) {
    showNotification("ไม่มีรายการขายให้ Export", "warning");
    return;
  }

  try {
    // สร้าง CSV content
    let csv = "เลขที่ใบเสร็จ,วันที่,จำนวนรายการ,ยอดรวม(บาท)\n";

    ordersData.forEach((order) => {
      const receiptNumber = order.receiptNumber || "N/A";
      const date = order.createdAt?.toDate()
        ? formatDateTime(order.createdAt.toDate())
        : "N/A";
      const itemCount = order.items?.length || 0;
      const totalPrice = order.totalPrice || 0;

      csv += `${receiptNumber},"${date}",${itemCount},${totalPrice.toFixed(2)}\n`;
    });

    // สร้าง Blob และ download
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const filename = `รายการขาย_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Export สำเร็จ", "success");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    showNotification("ไม่สามารถ Export ได้", "danger");
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getStockStatus(stock, type) {
  const threshold = type === "hose" ? 20 : 10;

  if (stock === 0) {
    return { class: "danger", label: "หมด" };
  } else if (stock < threshold) {
    return { class: "warning", label: "ใกล้หมด" };
  } else {
    return { class: "success", label: "พร้อมจำหน่าย" };
  }
}

function formatCurrency(amount) {
  return (
    new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " ฿"
  );
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <span>${type === "success" ? "✅" : "❌"}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

if (typeof window !== "undefined") {
  window.loadHoses = loadHoses;
  window.loadFittings = loadFittings;
  window.loadOrders = loadOrders;
  window.addHose = addHose;
  window.updateHoseData = updateHoseData;
  window.deleteHoseData = deleteHoseData;
  window.addFittingData = addFittingData;
  window.updateFittingData = updateFittingData;
  window.deleteFittingData = deleteFittingData;
  window.showNotification = showNotification;
  window.formatCurrency = formatCurrency;
  window.formatDateTime = formatDateTime;

  // CSS for animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
