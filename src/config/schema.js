const joi = require("joi");

const listingSchema = joi.object({
    title: joi.string().max(100).required(),
    description: joi.string().max(1000).required(),
    location: joi.string().max(100).required(),
    country: joi.string().max(100).required(),
    price: joi.number().min(0).required(),
    image: joi.string().uri().allow('').optional()
});

const reviewSchema = joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().max(500).required(),
    author: joi.string().max(50).required()
});

module.exports = { listingSchema, reviewSchema };