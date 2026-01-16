function printReceipt() {
  if (cart.length === 0) {
    showAlert("ไม่มีสินค้าในตะกร้า", "warning");
    return;
  }

  try {
    // Populate receipt template
    populateReceiptTemplate();

    // Show receipt template
    const template = document.getElementById("receiptTemplate");
    const originalContent = document.body.innerHTML;

    // Hide everything except receipt
    document.body.innerHTML = template.innerHTML;

    // Print
    window.print();

    // Restore original content
    document.body.innerHTML = originalContent;

    // Re-initialize after restore
    location.reload();
  } catch (error) {
    console.error("Error printing receipt:", error);
    showAlert("ไม่สามารถพิมพ์ใบเสร็จได้", "danger");
  }
}

// Populate receipt template with cart data
function populateReceiptTemplate() {
  const receiptNumber = generateReceiptNumber();
  const currentDate = formatThaiDate(new Date());

  // Set receipt header
  document.getElementById("receiptNumber").textContent = receiptNumber;
  document.getElementById("receiptDate").textContent = currentDate;

  // Populate items
  const itemsBody = document.getElementById("receiptItems");
  itemsBody.innerHTML = cart
    .map(
      (item) => `
    <tr>
      <td style="padding: 0.5rem; border-bottom: 1px solid #ddd;">
        ${item.name} ${item.size}
      </td>
      <td style="text-align: center; padding: 0.5rem; border-bottom: 1px solid #ddd;">
        ${item.quantity} ${item.unit}
      </td>
      <td style="text-align: right; padding: 0.5rem; border-bottom: 1px solid #ddd;">
        ${item.totalPrice.toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  // Calculate totals
  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = 0;
  const netPrice = totalPrice - discount;

  document.getElementById("receiptTotal").textContent = totalPrice.toFixed(2);
  document.getElementById("receiptNet").textContent = netPrice.toFixed(2);
}

// ========================================
// Generate PDF Receipt (using jsPDF)
// ========================================

function generatePDFReceipt() {
  if (cart.length === 0) {
    showAlert("ไม่มีสินค้าในตะกร้า", "warning");
    return;
  }

  // Check if jsPDF is available
  if (typeof window.jspdf === "undefined") {
    console.warn("jsPDF not loaded, falling back to window.print()");
    printReceipt();
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const receiptNumber = generateReceiptNumber();
    const currentDate = formatThaiDate(new Date());

    // Header
    doc.setFontSize(20);
    doc.text("ใบเสร็จรับเงิน", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("ร้านสายไฮดรอลิค", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.text(`เลขที่: ${receiptNumber}`, 20, 45);
    doc.text(`วันที่: ${currentDate}`, 20, 52);

    // Line separator
    doc.line(20, 58, 190, 58);

    // Table header
    let y = 68;
    doc.setFontSize(10);
    doc.text("รายการ", 20, y);
    doc.text("จำนวน", 120, y, { align: "center" });
    doc.text("ราคา", 180, y, { align: "right" });

    y += 5;
    doc.line(20, y, 190, y);

    // Items
    y += 8;
    cart.forEach((item) => {
      const itemText = `${item.name} ${item.size}`;
      const quantityText = `${item.quantity} ${item.unit}`;
      const priceText = `${item.totalPrice.toFixed(2)} บาท`;

      doc.text(itemText, 20, y);
      doc.text(quantityText, 120, y, { align: "center" });
      doc.text(priceText, 180, y, { align: "right" });

      y += 7;
    });

    // Line separator
    y += 3;
    doc.line(20, y, 190, y);

    // Total
    y += 10;
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    doc.setFontSize(12);
    doc.text("ยอดรวม:", 140, y);
    doc.text(`${totalPrice.toFixed(2)} บาท`, 180, y, { align: "right" });

    y += 8;
    doc.setFontSize(14);
    doc.text("ยอดสุทธิ:", 140, y);
    doc.text(`${totalPrice.toFixed(2)} บาท`, 180, y, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.text("ขอบคุณที่ใช้บริการ", 105, 280, { align: "center" });

    // Save PDF
    doc.save(`receipt_${receiptNumber}.pdf`);

    showAlert("สร้าง PDF สำเร็จ", "success");
  } catch (error) {
    console.error("Error generating PDF:", error);
    showAlert("ไม่สามารถสร้าง PDF ได้", "danger");
  }
}

// ========================================
// View Order Receipt (Admin)
// ========================================

async function viewOrder(orderId) {
  try {
    const order = await getDoc("orders", orderId);

    if (!order) {
      showAlert("ไม่พบข้อมูลรายการ", "danger");
      return;
    }

    // Create modal to show order details
    showOrderModal(order);
  } catch (error) {
    console.error("Error viewing order:", error);
    showAlert("ไม่สามารถแสดงรายการได้", "danger");
  }
}

function showOrderModal(order) {
  const modal = document.createElement("div");
  modal.className = "modal active";
  modal.style.cssText = `
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    align-items: center;
    justify-content: center;
  `;

  const date = order.createdAt?.toDate()
    ? formatThaiDate(order.createdAt.toDate())
    : "N/A";

  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">
        ${item.name} ${item.size}
      </td>
      <td style="text-align: center; padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">
        ${item.quantity} ${item.unit}
      </td>
      <td style="text-align: right; padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">
        ${item.pricePerUnit.toFixed(2)} บาท
      </td>
      <td style="text-align: right; padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">
        <strong>${item.totalPrice.toFixed(2)} บาท</strong>
      </td>
    </tr>
  `,
    )
    .join("");

  modal.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0;">
        <h2 style="font-size: 1.5rem; font-weight: 600;">รายละเอียดใบเสร็จ</h2>
        <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: #64748b;">
          ✕
        </button>
      </div>

      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">เลขที่ใบเสร็จ</p>
            <p style="font-weight: 600; font-size: 1.125rem;">${order.receiptNumber || "N/A"}</p>
          </div>
          <div>
            <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">วันที่</p>
            <p style="font-weight: 600; font-size: 1.125rem;">${date}</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">รายการสินค้า</h3>
        <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="text-align: left; padding: 0.75rem; font-weight: 600;">รายการ</th>
                <th style="text-align: center; padding: 0.75rem; font-weight: 600;">จำนวน</th>
                <th style="text-align: right; padding: 0.75rem; font-weight: 600;">ราคา/หน่วย</th>
                <th style="text-align: right; padding: 0.75rem; font-weight: 600;">รวม</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 2px solid #2563eb;">
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 1.25rem;">
          <span style="font-weight: 600;">ยอดรวม:</span>
          <span style="font-weight: 700; color: #2563eb;">${order.totalPrice.toFixed(2)} บาท</span>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button onclick="this.closest('.modal').remove()" style="flex: 1; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; background: #64748b; color: white;">
          ปิด
        </button>
        <button onclick="printOrderReceipt('${order.id}')" style="flex: 1; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; background: #2563eb; color: white;">
          🖨️ พิมพ์
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Print order receipt from admin
async function printOrderReceipt(orderId) {
  try {
    const order = await getDoc("orders", orderId);

    if (!order) {
      showAlert("ไม่พบข้อมูลรายการ", "danger");
      return;
    }

    // Create temporary cart
    const tempCart = order.items;
    const originalCart = cart;
    cart = tempCart;

    // Print
    printReceipt();

    // Restore original cart
    cart = originalCart;
  } catch (error) {
    console.error("Error printing order receipt:", error);
    showAlert("ไม่สามารถพิมพ์ใบเสร็จได้", "danger");
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatThaiDate(date) {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function generateReceiptNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const time =
    date.getHours().toString().padStart(2, "0") +
    date.getMinutes().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `RC${year}${month}${day}-${time}${random}`;
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

if (typeof window !== "undefined") {
  window.printReceipt = printReceipt;
  window.generatePDFReceipt = generatePDFReceipt;
  window.viewOrder = viewOrder;
  window.printOrderReceipt = printOrderReceipt;
}
