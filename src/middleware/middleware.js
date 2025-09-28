const Listing = require("../../models/listing");
const Review = require("../../models/review");
const ExpressError = require("../utils/ExpressError");

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to log in first.');
        res.redirect('/auth/login');
    },
    isLoggedOut: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'You are already logged in.');
        res.redirect('/');
    },
    saveRedirectUrl: (req, res, next) => {
        if (req.originalUrl) {
            res.locals.returnTo = req.session.returnTo || '/listings'; // Default to /listings if no returnTo is set
        }
        next();
    },
    isListingOwner: async (req, res, next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return next(new ExpressError("Listing not found", 404));
        }
        if (!listing.owner.equals(req.user._id)) {
            return next(new ExpressError("You do not have permission to edit this listing", 403));
        }
        next();
    },
    isReviewAuthor: async (req, res, next) => {
        const Review = require("../../models/review");
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) {
            return next(new ExpressError("Review not found", 404));
        }
        if (!review.author.equals(req.user._id)) {
            return next(new ExpressError("You do not have permission to delete this review", 403));
        }
        next();
    },
};
