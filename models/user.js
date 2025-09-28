const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    // username and password will be added by passport-local-mongoose
    email: {
        type: String,
        required: true,
        unique: true
    },
});

userSchema.plugin(passportLocalMongoose); // we use this plugin to handle password hashing and salting

module.exports = mongoose.model("User", userSchema);
