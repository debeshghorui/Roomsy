const User = require("../../models/user");
const ExpressError = require("../utils/ExpressError");

class UserController {
    // Show signup form
    static showSignupForm(req, res) {
        res.render("users/signup");
    }

    // Handle user registration
    static async registerUser(req, res, next) {
        try {
            const { email, username, password } = req.body;

            // Basic validation
            if (!email || !username || !password) {
                throw new ExpressError("All fields are required", 400);
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ExpressError("Please provide a valid email address", 400);
            }

            // Password strength validation
            if (password.length < 6) {
                throw new ExpressError("Password must be at least 6 characters long", 400);
            }

            const newUser = new User({
                email: email.trim().toLowerCase(),
                username: username.trim()
            });

            const registeredUser = await User.register(newUser, password);
            console.log("User registered:", registeredUser.username);

            // Automatically log in the user after registration
            req.login(registeredUser, err => {
                if (err) return next(err);

                req.flash("success", `Welcome to Wanderlust, ${registeredUser.username}!`);
                res.redirect("/listings");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/auth/signup");
        }
    }

    // Show login form
    static showLoginForm(req, res) {
        res.render("users/login");
    }

    // Handle successful login (called after passport authentication)
    static handleLogin(req, res) {
        req.flash("success", `Welcome back, ${req.user.username}!`);
        const redirectUrl = res.locals.returnTo || "/listings";
        res.redirect(redirectUrl);
    }

    // Handle login failure
    static handleLoginFailure(req, res) {
        req.flash("error", "Invalid username or password. Please try again.");
        res.redirect("/auth/login");
    }

    // Handle user logout
    static logoutUser(req, res, next) {
        const username = req.user ? req.user.username : null;
        
        req.logout((err) => {
            if (err) return next(err);

            // Clear user from locals
            res.locals.currentUser = null;

            req.flash("success", username ? `Goodbye, ${username}!` : "You have been logged out!");
            res.redirect("/listings");
        });
    }

    // Get user profile (if needed)
    static async getUserProfile(req, res) {
        const userId = req.params.id || req.user._id;

        const user = await User.findById(userId)
            .select('-password') // Exclude password field
            .populate({
                path: 'listings',
                select: 'title price location image'
            });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/listings");
        }

        res.render("users/profile", { user });
    }

    // Update user profile (if needed)
    static async updateUserProfile(req, res) {
        const userId = req.user._id;
        const { email, username } = req.body;

        try {
            // Basic validation
            if (!email || !username) {
                throw new ExpressError("Email and username are required", 400);
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ExpressError("Please provide a valid email address", 400);
            }

            const updateData = {
                email: email.trim().toLowerCase(),
                username: username.trim()
            };

            const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true
            });

            if (!updatedUser) {
                throw new ExpressError("User not found", 404);
            }

            req.flash("success", "Profile updated successfully!");
            res.redirect(`/auth/profile/${userId}`);
        } catch (e) {
            req.flash("error", e.message);
            res.redirect(`/auth/profile/${userId}/edit`);
        }
    }

    // Delete user account (if needed)
    static async deleteUserAccount(req, res) {
        const userId = req.user._id;

        try {
            // Note: You might want to handle user's listings and reviews before deleting
            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                throw new ExpressError("User not found", 404);
            }

            req.logout((err) => {
                if (err) {
                    req.flash("error", "Error logging out after account deletion");
                    return res.redirect("/listings");
                }

                req.flash("success", "Your account has been deleted successfully");
                res.redirect("/");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/auth/profile");
        }
    }

    // Check if username is available (AJAX endpoint)
    static async checkUsernameAvailability(req, res) {
        const { username } = req.query;

        if (!username) {
            return res.json({ available: false, message: "Username is required" });
        }

        try {
            const existingUser = await User.findOne({ username: username.trim() });
            res.json({ 
                available: !existingUser,
                message: existingUser ? "Username is already taken" : "Username is available"
            });
        } catch (e) {
            res.json({ available: false, message: "Error checking username availability" });
        }
    }

    // Get all users (admin only, if needed)
    static async getAllUsers(req, res) {
        try {
            const users = await User.find()
                .select('-password')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (e) {
            throw new ExpressError("Error fetching users", 500);
        }
    }
}

module.exports = UserController;
