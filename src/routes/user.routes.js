const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/user.controller");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl, isLoggedIn } = require("../middleware/middleware");
const { validateUserRegistration, validateUserLogin, sanitizeInput } = require("../middleware/validation");

// Authentication Routes
// Registration routes
router.get("/signup", UserController.showSignupForm);
router.post("/signup", 
    sanitizeInput,
    validateUserRegistration,
    wrapAsync(UserController.registerUser)
);

// Login routes
router.get("/login", UserController.showLoginForm);
router.post("/login", 
    sanitizeInput,
    validateUserLogin,
    saveRedirectUrl, 
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/auth/login"
    }), 
    UserController.handleLogin
);

// Logout route
router.get("/logout", UserController.logoutUser);

// Profile Routes (Optional - for future use)
router.get("/profile/:id?", isLoggedIn, wrapAsync(UserController.getUserProfile));
router.get("/profile/:id/edit", isLoggedIn, (req, res) => {
    res.render("users/edit-profile", { user: req.user });
});
router.patch("/profile/:id", isLoggedIn, sanitizeInput, wrapAsync(UserController.updateUserProfile));
router.delete("/profile/:id", isLoggedIn, wrapAsync(UserController.deleteUserAccount));

// API Routes (Optional - for AJAX calls)
router.get("/check-username", UserController.checkUsernameAvailability);
router.get("/api/users", isLoggedIn, wrapAsync(UserController.getAllUsers)); // Admin only

module.exports = router;