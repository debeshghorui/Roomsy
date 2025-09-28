const express = require("express");
const router = express.Router({ mergeParams: true });

const ReviewController = require("../controllers/review.controller");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware/middleware");
const { validateReview, validateObjectId, sanitizeInput } = require("../middleware/validation");

// Review Routes
// Create a new review for a listing
router.post("/", 
    validateObjectId('id'),
    isLoggedIn, 
    sanitizeInput,
    validateReview, 
    wrapAsync(ReviewController.createReview)
);

// Delete a review
router.route("/:reviewId")
    .get( // Get single review by ID (API endpoint)
        validateObjectId('reviewId'),
        wrapAsync(ReviewController.getReviewById)
    )
    .patch( // Update review with validation
        validateObjectId('reviewId'),
        isLoggedIn,
        isReviewAuthor,
        sanitizeInput,
        validateReview,
        wrapAsync(ReviewController.updateReview)
    )
    .delete( // Delete review with validation
        validateObjectId('id'),
        validateObjectId('reviewId'),
        isLoggedIn, 
        isReviewAuthor, 
        wrapAsync(ReviewController.deleteReview)
    )

// Get all reviews for a listing (API endpoint)
router.get("/", 
    validateObjectId('id'),
    wrapAsync(ReviewController.getReviewsByListing)
);

module.exports = router;