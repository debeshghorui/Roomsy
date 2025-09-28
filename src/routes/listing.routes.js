const express = require("express");
const router = express.Router();

const ListingController = require("../controllers/listing.controller");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isListingOwner } = require("../middleware/middleware");
const { validateListing, validateObjectId, sanitizeInput } = require("../middleware/validation");
const { storage } = require("../config/cloud.config");
const multer = require('multer');
const upload = multer({ storage: storage }); // Multer setup for handling file uploads

// Routes for listings
router.route("/")
    .get( // Get all listings
        wrapAsync(ListingController.getAllListings)) 
    .post( // Create new listing with validation
        isLoggedIn,
        sanitizeInput,
        // validateListing,
        upload.single('listing[image]'), // Handle single file upload with field name 'listing[image]'
        wrapAsync(ListingController.createListing)
      );

// Get new listing form (MUST come before /:id)
router.get("/new", isLoggedIn, ListingController.showNewForm);

// Routes for specific listing by ID
router.route("/:id")
    .get( // Get single listing with validation
        validateObjectId('id'),
        wrapAsync(ListingController.getListingById)
    )
    .delete( // Delete listing with validation
        validateObjectId('id'),
        isLoggedIn,
        isListingOwner,
        wrapAsync(ListingController.deleteListing)
    );

// Get edit form with validation
router.route("/:id/edit")
    .get( // Show edit form with validation
        validateObjectId('id'),
        isLoggedIn, 
        isListingOwner, 
        wrapAsync(ListingController.showEditForm)
    )
    .patch( // Update listing with validation
        validateObjectId('id'),
        isLoggedIn, 
        isListingOwner, 
        upload.single('listing[image]'), // Handle single file upload with field name 'listing[image]'
        sanitizeInput,
        // validateListing, 
        wrapAsync(ListingController.updateListing)
    );

module.exports = router;