const mongoose = require("mongoose");
const Listing = require("../../models/listing");
const Review = require("../../models/review");
const ExpressError = require("../utils/ExpressError");

// Mapbox Geocoding setup
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_BOX_TOKEN });
class ListingController {
    // Get all listings
    static async getAllListings(req, res) {
        const listings = await Listing.find().populate('reviews');
        res.render("listings/listings", { listings });
    }

    // Show new listing form
    static showNewForm(req, res) {
        res.render("listings/new");
    }

    // Get single listing with populated reviews
    static async getListingById(req, res) {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError("Invalid listing ID", 400);
        }

        const listing = await Listing.findById(id)
            .populate({                 // Nested populate for reviews and their authors
                path: 'reviews',
                populate: {             // Nested populate for review authors
                    path: 'author',
                    select: 'username'
                }
            })
            .populate('owner');

        if (!listing) {
            req.flash("error", "Listing does not exist!");
            return res.redirect("/listings");
        }
        res.render("listings/listing", { listing });
    }

    // Show edit form
    static async showEditForm(req, res) {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }

        const listing = await ListingController.findListingOrThrow(id);

        if (listing.image && listing.image.url) {
            let lowResImageUrl = listing.image.url;

            lowResImageUrl = lowResImageUrl.replace("/upload/", "/upload/h_200,w_350/");

            listing.image.url = lowResImageUrl;
        }

        res.render("listings/edit", { listing });
    }

    // Create new listing
    static async createListing(req, res) {
        const { filename, path } = req.file || {};
        const { title, description, location, country, price } = req.body;
        
        // Additional validation
        if (!title || !description || !location || !country || !price || !req.user) {
            throw new ExpressError("All required fields must be provided", 400);
        }

        if (isNaN(price) || price <= 0) {
            throw new ExpressError("Price must be a positive number", 400);
        }

        let geoLocation = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();

        if (!geoLocation.body.features.length) {
            throw new ExpressError("Invalid location provided", 400);
        }

        // Create and save the new listing
        const newListing = new Listing({
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            country: country.trim(),
            geoLocation: geoLocation.body.features[0].geometry,
            price: parseFloat(price),
            image: {
                filename: filename || "listing[image]",
                url: path && path.trim() ? path.trim() : "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            },
            owner: req.user._id
        });

        await newListing.save();
        req.flash("success", "Listing created successfully!");
        res.redirect("/listings");
    }

    // Update listing
    static async updateListing(req, res) {
        const { id } = req.params;
        const { title, description, location, country, price } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError("Invalid listing ID", 400);
        }

        // Additional validation
        if (price && (isNaN(price) || price <= 0)) {
            throw new ExpressError("Price must be a positive number", 400);
        }

        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (location) updateData.location = location.trim();
        if (country) updateData.country = country.trim();
        if (price) updateData.price = parseFloat(price);

        if (typeof req.file !== 'undefined') {
            let { filename, path } = req.file || {};
            if (filename && path) {
                updateData.image = {
                    filename: filename,
                    url: path.trim() ? path.trim() : "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                };
            }
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true // Run mongoose validators
        });

        if (!updatedListing) {
            throw new ExpressError("Listing not found", 404);
        }

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    }

    // Delete listing
    static async deleteListing(req, res) {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ExpressError("Invalid listing ID", 400);
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError("Listing not found", 404);
        }

        // Delete associated reviews first
        await Review.deleteMany({ listing: id });

        // Delete the listing
        await Listing.findByIdAndDelete(id);

        req.flash("success", "Listing and associated reviews deleted successfully!");
        res.redirect("/listings");
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

module.exports = ListingController;