const mongoose = require("mongoose");
const Listing = require("../../models/listing");
const Review = require("../../models/review");
const ExpressError = require("../utils/ExpressError");

class ReviewController {
    // Create a new review for a listing
    static async createReview(req, res) {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError("Invalid listing ID", 400);
        }

        const listing = await ReviewController.findListingOrThrow(id);
        const { rating, comment } = req.body;
        const author = req.user ? req.user._id : null;

        if (!author) {
            throw new ExpressError("You must be logged in to post a review", 401);
        }

        // Additional validation
        if (!rating || !comment || !author) {
            throw new ExpressError("Rating, comment, and author are required", 400);
        }

        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            throw new ExpressError("Rating must be between 1 and 5", 400);
        }

        const newReview = new Review({
            listing: id,
            rating: ratingNum,
            comment: comment.trim(),
            author: author
        });

        await newReview.save();

        // Add the review to the listing's reviews array
        listing.reviews.push(newReview._id);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${id}`);
    }

    // Delete a review
    static async deleteReview(req, res) {
        const { id, reviewId } = req.params;

        // Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
            throw new ExpressError("Invalid ID format", 400);
        }

        // Check if listing exists
        await ReviewController.findListingOrThrow(id);

        // Remove the review from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        // Delete the review
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            throw new ExpressError("Review not found", 404);
        }

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    }

    // Get all reviews for a listing (if needed for API)
    static async getReviewsByListing(req, res) {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError("Invalid listing ID", 400);
        }

        const reviews = await Review.find({ listing: id })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }

    // Get single review by ID (if needed for API)
    static async getReviewById(req, res) {
        const { reviewId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            throw new ExpressError("Invalid review ID", 400);
        }

        const review = await Review.findById(reviewId)
            .populate('author', 'username')
            .populate('listing', 'title');

        if (!review) {
            throw new ExpressError("Review not found", 404);
        }

        res.json({
            success: true,
            data: review
        });
    }

    // Update review (if needed)
    static async updateReview(req, res) {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            throw new ExpressError("Invalid review ID", 400);
        }

        // Validation
        if (rating) {
            const ratingNum = parseInt(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                throw new ExpressError("Rating must be between 1 and 5", 400);
            }
        }

        const updateData = {};
        if (rating) updateData.rating = parseInt(rating);
        if (comment) updateData.comment = comment.trim();

        const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, {
            new: true,
            runValidators: true
        }).populate('author', 'username');

        if (!updatedReview) {
            throw new ExpressError("Review not found", 404);
        }

        req.flash("success", "Review updated successfully!");
        res.json({
            success: true,
            data: updatedReview
        });
    }

    // Helper method to find listing by ID with error handling
    static async findListingOrThrow(id) {
        const listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError("Listing not found", 404);
        }
        return listing;
    }
}

module.exports = ReviewController;
