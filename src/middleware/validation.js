const { listingSchema, reviewSchema } = require("../config/schema");
const ExpressError = require("../utils/ExpressError");

// Validation middleware for listings
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    next();
};

// Validation middleware for reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    next();
};

// Validation middleware for user registration
const validateUserRegistration = (req, res, next) => {
    const { email, username, password } = req.body;

    // Check required fields
    if (!email || !username || !password) {
        req.flash("error", "All fields are required");
        return res.redirect("/auth/signup");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        req.flash("error", "Please provide a valid email address");
        return res.redirect("/auth/signup");
    }

    // Username validation
    if (username.length < 3) {
        req.flash("error", "Username must be at least 3 characters long");
        return res.redirect("/auth/signup");
    }

    // Password strength validation
    if (password.length < 6) {
        req.flash("error", "Password must be at least 6 characters long");
        return res.redirect("/auth/signup");
    }

    next();
};

// Validation middleware for user login
const validateUserLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.flash("error", "Username and password are required");
        return res.redirect("/auth/login");
    }

    next();
};

// MongoDB ObjectId validation
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        const mongoose = require("mongoose");
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError(`Invalid ${paramName}`, 400);
        }
        next();
    };
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Trim whitespace from string inputs
    for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }
    next();
};

// File upload validation (for future image uploads)
const validateFileUpload = (req, res, next) => {
    if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new ExpressError("Only JPEG, PNG, and WebP images are allowed", 400);
        }

        if (req.file.size > maxSize) {
            throw new ExpressError("File size must be less than 5MB", 400);
        }
    }
    next();
};

module.exports = {
    validateListing,
    validateReview,
    validateUserRegistration,
    validateUserLogin,
    validateObjectId,
    sanitizeInput,
    validateFileUpload
};
