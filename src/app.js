if(process.env.NODE_ENV != "production") require("dotenv").config();
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("../models/user");
const ExpressError = require("./utils/ExpressError");

const userRoutes = require("./routes/user.routes");
const listingRoutes = require("./routes/listing.routes");
const reviewRoutes = require("./routes/review.routes");

const app = express();

// MongoDB session store configuration
const MongoStoreOptions = {
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/wanderlust",
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret",
    },
    touchAfter: 24 * 3600, // time period in seconds
};

// Session configuration
const sessionOptions = {
    store: MongoStore.create(MongoStoreOptions),
    secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // Uncomment this when using HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
};

app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.use("/auth", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// 404
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error handler
app.use((error, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = error;
    res.status(status).render("listings/error", {
        status,
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
});

module.exports = app;