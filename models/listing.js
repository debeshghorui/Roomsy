const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
            default: "listing" // Default image filename
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // Default image URL
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    geoLocation: {
        type: {
            type: String,     // Don't do `{ type: String }`, it won't work
            enum: ["Point"],  // 'Point' is the only allowed type
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Review' 
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;