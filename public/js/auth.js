// ========================================
// Authentication Functions
// ========================================

// Login with Email & Password
async function loginWithEmail(email, password, rememberMe = false) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    // Save session
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("isLoggedIn", "true");
    storage.setItem("userEmail", user.email);
    storage.setItem("userId", user.uid);

    console.log("✅ Login successful:", user.email);
    return { success: true, user };
  } catch (error) {
    console.error("❌ Login error:", error);
    let message = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";

    switch (error.code) {
      case "auth/user-not-found":
        message = "ไม่พบผู้ใช้นี้ในระบบ";
        break;
      case "auth/wrong-password":
        message = "รหัสผ่านไม่ถูกต้อง";
        break;
      case "auth/invalid-email":
        message = "รูปแบบอีเมลไม่ถูกต้อง";
        break;
      case "auth/user-disabled":
        message = "บัญชีนี้ถูกระงับการใช้งาน";
        break;
      case "auth/too-many-requests":
        message = "พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่";
        break;
    }

    return { success: false, error: message };
  }
}

// Logout
function logout() {
  try {
    auth.signOut();

    // Clear all storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userId");

    console.log("✅ Logout successful");
    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    return { success: false, error: error.message };
  }
}

// Check if user is logged in
function isUserLoggedIn() {
  const localAuth = localStorage.getItem("isLoggedIn") === "true";
  const sessionAuth = sessionStorage.getItem("isLoggedIn") === "true";
  return localAuth || sessionAuth;
}

// Get current user email
function getCurrentUserEmail() {
  return (
    localStorage.getItem("userEmail") ||
    sessionStorage.getItem("userEmail") ||
    null
  );
}

// Get current user ID
function getCurrentUserId() {
  return (
    localStorage.getItem("userId") || sessionStorage.getItem("userId") || null
  );
}

// Protect admin pages
function protectAdminPage() {
  if (!isUserLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Redirect if already logged in
function redirectIfLoggedIn() {
  if (isUserLoggedIn()) {
    window.location.href = "admin.html";
  }
}

// ========================================
// Register New User (for initial setup)
// ========================================
async function registerUser(email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    console.log("✅ User registered:", user.email);
    return { success: true, user };
  } catch (error) {
    console.error("❌ Registration error:", error);
    let message = "เกิดข้อผิดพลาดในการลงทะเบียน";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "อีเมลนี้ถูกใช้งานแล้ว";
        break;
      case "auth/invalid-email":
        message = "รูปแบบอีเมลไม่ถูกต้อง";
        break;
      case "auth/weak-password":
        message = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        break;
    }

    return { success: false, error: message };
  }
}

// ========================================
// Password Reset
// ========================================
async function sendPasswordReset(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    console.log("✅ Password reset email sent");
    return { success: true };
  } catch (error) {
    console.error("❌ Password reset error:", error);
    return {
      success: false,
      error: "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้",
    };
  }
}

// ========================================
// Auth State Observer
// ========================================
function observeAuthState(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("👤 User is signed in:", user.email);
      callback({ loggedIn: true, user });
    } else {
      console.log("👤 User is signed out");
      callback({ loggedIn: false, user: null });
    }
  });
}

// ========================================
// Demo Login (ลบออกในการใช้งานจริง)
// ========================================
function demoLogin(email, password, rememberMe = false) {
  // For demo/testing only - remove in production
  const DEMO_EMAIL = "admin@hydraulic.com";
  const DEMO_PASSWORD = "admin123";

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("isLoggedIn", "true");
    storage.setItem("userEmail", email);
    storage.setItem("userId", "demo-user-id");

    return { success: true, user: { email, uid: "demo-user-id" } };
  }

  return {
    success: false,
    error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  };
}

// ========================================
// Export for use globally
// ========================================
if (typeof window !== "undefined") {
  window.loginWithEmail = loginWithEmail;
  window.logout = logout;
  window.isUserLoggedIn = isUserLoggedIn;
  window.getCurrentUserEmail = getCurrentUserEmail;
  window.getCurrentUserId = getCurrentUserId;
  window.protectAdminPage = protectAdminPage;
  window.redirectIfLoggedIn = redirectIfLoggedIn;
  window.registerUser = registerUser;
  window.sendPasswordReset = sendPasswordReset;
  window.observeAuthState = observeAuthState;
  window.demoLogin = demoLogin; // ลบในการใช้งานจริง
}
