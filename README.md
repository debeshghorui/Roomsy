# EJS Mate

## joi

EJS Mate is a layout engine for [EJS](https://ejs.co/) that adds support for layouts, partials, blocks, and more.

## mongoose pull operator

## mongoose middleware

```javascript
ListingSchema.post('findByIdAndDelete', function(next) {
  // Middleware logic here
  next();
});
```

## Express Router

Express Routers are a way to organize your Express application such that our primary app.js file does not become bloated.

```javascript
const router = express.Router(); // creates new router object
```

### Restructuring Reviews

```javascript
app.use("/listings/:id/reviews", reviews);
```

```javascript
router = express.Router({ mergeParams: true }); // mergeParams allows access to params from parent router
```

## Using Cookie Parser

```javascript
const express = require('express');
```

## Using Express Session

**Adding session Options** - Express Session

```javascript
const sessionOptions = {
    secret: 'thisshouldbeabettersecret',
    resave: false,  // don't save session if unmodified
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        maxAge: 24 * 60 * 60 * 1000 // 1 day
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
```

## Using Flash

**Success Partial** - Bootstrap

```ejs
<% if (success && success.length > 0) { %>
    <div class="container mt-3">
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <%= success %>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </div>  
<% } %>
```

**Error Partial** - Bootstrap

```ejs  
<% if (error && error.length > 0) { %>
    <div class="container mt-3">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <%= error %>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </div>
<% } %>
```

## Using Passport

**passport** is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped into any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.

**passport-local** is a Passport strategy for authenticating with a username and password.

**passport-local-mongoose** is a Mongoose plugin that simplifies building username and password login with Passport.

```javascript
const passportLocalMongoose = require('passport-local-mongoose');

UserSchema.plugin(passportLocalMongoose);
```

## Configuring Strategy

**passport.initialize()** - Middleware

A middleware that initializes passport.

**passport.session()** - Middleware

A web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session.

**passport.use(new LocalStrategy(User.authenticate()))** - Configures the strategy for authenticating with a username and password.

```javascript
passport.initialize(),
passport.session()
```

**passport.serializeUser()** - Determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here, for example, it is the user id (you can choose what you want to store).

**passport.deserializeUser()** - The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see serializeUser). So your whole object is retrieved with help of that key. That key here is the user id (you can choose what you want to store).

```javascript
passport.serializeUser(User.serializeUser());         // how to store user in session
passport.deserializeUser(User.deserializeUser());     // how to get user out of session
```

## Demo User

```javascript
app.get("/registerUser", async (req, res) => {
    let fakeUser = new User({
        email: "<student@gmail.com>",
        username: "delta-student",
    });

    let newUser = await User.register(fakeUser, "helloworld");
    res.send(newUser);
});
```

## Signup User

**GET /signup** - Displays the signup form

**POST /signup** - Handles user registration

```javascript
// Display signup form
app.get("/signup", (req, res) => {
    res.render("users/signup");
});

// Handle user registration
app.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    res.send(registeredUser);
});
```

## Login User

**GET /login** - Displays the login form

**POST /login** - Handles user login

```javascript
// Display login form
app.get("/login", (req, res) => {
    res.render("users/login");
});

// Handle user login
app.post("/login", passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}), (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});
```

## Connecting Login Routes

How to check if a user is logged in before accessing certain routes.

```javascript
req.isAuthenticated() // returns true if user is logged in
```

## Logout User

GET /logout

```javascript
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listings");
    });
});
```

## Login after SignUp

Passport's login method automatically establishes a login session.

We can invoke login to automatically login a user.

```javascript
req.login(registeredUser, (err) => {
    if (err) {
        next(err);
    }
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
});
```

## Listing Owner

```javascript
const isListingOwner = (req, res, next) => {
    const { user, listing } = req;
    if (user && listing && user._id.equals(listing.owner)) {
        return next();
    }
    req.flash("error", "You do not have permission to do that.");
    res.redirect("/listings");
};
```

## Starting with **Authorization**

```javascript

```

## Setting **Authorization** For Listing Routes

## Setting **Authorization** For Review Routes

## **MVC** : Model, View, Controller

**Implement Design Pattern** for Listing and Review routes

- **Model** - Mongoose Models
- **View** - EJS Templates
- **Controller** - Route Handlers

Listings: /listings
├── GET    /           → getAllListings
├── GET    /new        → showNewForm  
├── GET    /:id        → getListingById
├── GET    /:id/edit   → showEditForm
├── POST   /           → createListing
├── PATCH  /:id/edit   → updateListing
└── DELETE /:id        → deleteListing

Reviews: /listings/:id/reviews  
├── POST   /           → createReview
├── DELETE /:reviewId  → deleteReview
├── GET    /           → getReviewsByListing (API)
├── GET    /:reviewId  → getReviewById (API)
└── PATCH  /:reviewId  → updateReview (API)

Users: /auth
├── GET    /signup     → showSignupForm
├── POST   /signup     → registerUser
├── GET    /login      → showLoginForm
├── POST   /login      → handleLogin
├── GET    /logout     → logoutUser
└── Profile routes (ready for future use)

## **Router.route**

A way to group together routes with different verbs but same paths

```javascript
router.route('/users/:user_id')
    .all(function (req, res, next) {
        // runs for all HTTP verbs first
        // think of it as route specific middleware! next
        next();
    })
    .get(function (req, res, next) {
        res.json(req.user);
    })
    .put(function (req, res, next) {
        // just an example of maybe updating the user
        req.user.name = req.params.name;

        // save user
        req.user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json(req.user);
        });
    })
    .post(function (req, res, next) {
        next(new Error("not implemented"));
    })
    .delete(function (req, res, next) {
        next(new Error("not implemented"));
    });
```

## Re-style Ratings

Re-style rating using **starability.js**

## Image Uploads

problems with storing images directly in our database

1. We don't store images in our database
2. we also have size limits on images
3. We want to be able to easily transform images (resize, crop, etc)

We have Use 3rd party cloud service like **Cloudinary** and **Multer** for image uploads

### **Manipulating Forms for File Uploads**

**enctype**="multipart/form-data"

To upload files, we need to set the form's **enctype**="multipart/form-data" because files are binary data and need to be encoded differently than regular text data.

```html
<div class="mb-3">
    <label for="image">Image</label>
    <input type="file" class="form-control" id="image" name="image" accept="image/*">
</div>
```

We use `multer` to handle `multipart/form-data` which is primarily used for uploading files.

Note: It's will not process any form which is not multipart (multipart/form-data).

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
```

`.env` is used to store environment variables that your application needs to run. These variables can include sensitive information such as API keys, database connection strings, and other configuration settings.

### Cloud Setup

We use **Cloudinary** for image uploads and **dotenv** to manage environment variables.

#### Store Files

**Multer Store Cloudinary** 

```bash
npm install cloudinary multer-storage-cloudinary
```

```javascript
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "your-folder-name", // The name of the folder in Cloudinary
    allowedFormats: ["jpg", "png", "jpeg"],
});

const upload = multer({ storage: storage });
```

#### Save Image URL to MongoDB

```javascript
const Listing = require("../models/listing.model");

router.post("/", upload.single("listing[image]"), async (req, res) => {
    try {
        const newListing = new Listing({
            title: req.body.title,
            description: req.body.description,
            image: req.file.path, // Save the image URL from Cloudinary
        });
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
```
