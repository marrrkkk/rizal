// Manual test file for authentication utilities
// Run this in the browser console to test authentication

import {
  register,
  login,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} from "../auth.js";

// Test 1: Password hashing
export const testPasswordHashing = async () => {
  console.log("🧪 Test 1: Password Hashing");

  const password = "testPassword123";
  const hash = await hashPassword(password);

  console.log("Original password:", password);
  console.log("Hashed password:", hash);
  console.log("Hash is different from password:", hash !== password);

  const isValid = await verifyPassword(password, hash);
  console.log("Password verification:", isValid ? "✅ PASS" : "❌ FAIL");

  const isInvalid = await verifyPassword("wrongPassword", hash);
  console.log("Wrong password rejected:", !isInvalid ? "✅ PASS" : "❌ FAIL");

  return isValid && !isInvalid;
};

// Test 2: JWT Token Generation
export const testTokenGeneration = () => {
  console.log("\n🧪 Test 2: JWT Token Generation");

  const payload = { userId: 1, username: "testuser", isAdmin: false };
  const token = generateToken(payload);

  console.log("Generated token:", token);
  console.log(
    "Token is a string:",
    typeof token === "string" ? "✅ PASS" : "❌ FAIL"
  );

  const decoded = verifyToken(token);
  console.log("Decoded token:", decoded);
  console.log(
    "Username matches:",
    decoded.username === "testuser" ? "✅ PASS" : "❌ FAIL"
  );
  console.log("UserId matches:", decoded.userId === 1 ? "✅ PASS" : "❌ FAIL");

  return decoded && decoded.username === "testuser" && decoded.userId === 1;
};

// Test 3: User Registration
export const testRegistration = async () => {
  console.log("\n🧪 Test 3: User Registration");

  try {
    const username = "testuser_" + Date.now();
    const password = "testPassword123";

    const result = await register(username, password);

    console.log("Registration result:", result);
    console.log("Token received:", result.token ? "✅ PASS" : "❌ FAIL");
    console.log("User object received:", result.user ? "✅ PASS" : "❌ FAIL");
    console.log(
      "Username matches:",
      result.user.username === username ? "✅ PASS" : "❌ FAIL"
    );

    return result.token && result.user && result.user.username === username;
  } catch (error) {
    console.error("Registration failed:", error);
    return false;
  }
};

// Test 4: User Login
export const testLogin = async () => {
  console.log("\n🧪 Test 4: User Login");

  try {
    // First register a user
    const username = "logintest_" + Date.now();
    const password = "testPassword123";

    await register(username, password);
    console.log("User registered for login test");

    // Now try to login
    const result = await login(username, password);

    console.log("Login result:", result);
    console.log("Token received:", result.token ? "✅ PASS" : "❌ FAIL");
    console.log("User object received:", result.user ? "✅ PASS" : "❌ FAIL");
    console.log(
      "Username matches:",
      result.user.username === username ? "✅ PASS" : "❌ FAIL"
    );

    // Try login with wrong password
    try {
      await login(username, "wrongPassword");
      console.log(
        "Wrong password rejected:",
        "❌ FAIL - should have thrown error"
      );
      return false;
    } catch (error) {
      console.log("Wrong password rejected:", "✅ PASS");
    }

    return result.token && result.user && result.user.username === username;
  } catch (error) {
    console.error("Login test failed:", error);
    return false;
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log("🚀 Running Authentication Tests\n");
  console.log("=".repeat(50));

  const test1 = await testPasswordHashing();
  const test2 = testTokenGeneration();
  const test3 = await testRegistration();
  const test4 = await testLogin();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results:");
  console.log("Password Hashing:", test1 ? "✅ PASS" : "❌ FAIL");
  console.log("Token Generation:", test2 ? "✅ PASS" : "❌ FAIL");
  console.log("User Registration:", test3 ? "✅ PASS" : "❌ FAIL");
  console.log("User Login:", test4 ? "✅ PASS" : "❌ FAIL");

  const allPassed = test1 && test2 && test3 && test4;
  console.log(
    "\n" + (allPassed ? "✅ All tests passed!" : "❌ Some tests failed")
  );

  return allPassed;
};

// Export for browser console testing
if (typeof window !== "undefined") {
  window.authTests = {
    testPasswordHashing,
    testTokenGeneration,
    testRegistration,
    testLogin,
    runAllTests,
  };
  console.log(
    "💡 Authentication tests loaded. Run window.authTests.runAllTests() to test."
  );
}
