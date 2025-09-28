# MVC Structure Documentation

## Project Structure Overview

The project has been reorganized following the **Model-View-Controller (MVC)** architectural pattern for better code organization, maintainability, and separation of concerns.

## Directory Structure

```
src/
├── controllers/           # Business logic layer
│   ├── listing.controller.js
│   ├── review.controller.js
│   └── user.controller.js
├── routes/               # Route definitions (thin layer)
│   ├── listing.routes.js
│   ├── review.routes.js
│   └── user.routes.js
├── middleware/           # Custom middleware
│   ├── middleware.js     # Authentication & authorization
│   └── validation.js     # Input validation
├── utils/               # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
├── app.js              # Express app configuration
└── server.js           # Server startup
```

## MVC Components

### 1. Models (`/models`)
- **listing.js** - Listing data model
- **review.js** - Review data model  
- **user.js** - User data model

### 2. Views (`/views`)
- **EJS templates** for rendering HTML
- Organized by feature (listings, users, components)

### 3. Controllers (`/src/controllers`)

#### ListingController
- `getAllListings()` - Fetch and display all listings
- `getListingById()` - Get single listing with reviews
- `showNewForm()` - Display new listing form
- `showEditForm()` - Display edit listing form
- `createListing()` - Create new listing
- `updateListing()` - Update existing listing
- `deleteListing()` - Delete listing and associated reviews

#### ReviewController  
- `createReview()` - Add new review to listing
- `deleteReview()` - Remove review from listing
- `getReviewsByListing()` - Get all reviews for a listing (API)
- `getReviewById()` - Get single review (API)
- `updateReview()` - Update review (API)

#### UserController
- `showSignupForm()` - Display registration form
- `showLoginForm()` - Display login form
- `registerUser()` - Handle user registration
- `handleLogin()` - Handle successful login
- `logoutUser()` - Handle user logout
- `getUserProfile()` - Display user profile
- `updateUserProfile()` - Update user profile
- `deleteUserAccount()` - Delete user account
- `checkUsernameAvailability()` - AJAX username check

## Middleware Organization

### Authentication & Authorization (`/src/middleware/middleware.js`)
- `isLoggedIn` - Ensure user is authenticated
- `isLoggedOut` - Ensure user is not authenticated  
- `saveRedirectUrl` - Save URL for post-login redirect
- `isListingOwner` - Verify listing ownership
- `isReviewAuthor` - Verify review authorship

### Validation (`/src/middleware/validation.js`)
- `validateListing` - Joi schema validation for listings
- `validateReview` - Joi schema validation for reviews
- `validateUserRegistration` - User registration validation
- `validateUserLogin` - User login validation
- `validateObjectId` - MongoDB ObjectId validation
- `sanitizeInput` - Input sanitization
- `validateFileUpload` - File upload validation

## Route Organization

### Listing Routes (`/listings`)
```
GET    /           - List all listings
GET    /new        - Show new listing form
GET    /:id        - Show single listing
GET    /:id/edit   - Show edit form
POST   /           - Create new listing
PATCH  /:id/edit   - Update listing
DELETE /:id        - Delete listing
```

### Review Routes (`/listings/:id/reviews`)
```
POST   /           - Create review
DELETE /:reviewId  - Delete review
GET    /           - Get reviews (API)
GET    /:reviewId  - Get single review (API)
PATCH  /:reviewId  - Update review (API)
```

### User Routes (`/auth`)
```
GET    /signup     - Show signup form
POST   /signup     - Register user
GET    /login      - Show login form
POST   /login      - Login user
GET    /logout     - Logout user
GET    /profile/:id - Show user profile
PATCH  /profile/:id - Update profile
DELETE /profile/:id - Delete account
```

## Key Benefits of This Structure

### 1. **Separation of Concerns**
- **Routes**: Handle HTTP requests and responses
- **Controllers**: Contain business logic
- **Models**: Handle data operations
- **Middleware**: Handle cross-cutting concerns

### 2. **Maintainability**
- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Reduced code duplication

### 3. **Scalability**
- Easy to add new features
- Controllers can be easily unit tested
- Clear structure for team development

### 4. **Security**
- Centralized validation middleware
- Input sanitization
- Proper authentication/authorization checks

### 5. **Code Reusability**
- Controller methods can be reused
- Middleware functions are modular
- Utility functions are centralized

## Usage Examples

### Adding a New Route
```javascript
// In routes file
router.get('/special', 
    isLoggedIn,
    validateObjectId('id'),
    wrapAsync(ListingController.specialMethod)
);

// In controller file
static async specialMethod(req, res) {
    // Business logic here
    res.render('listings/special', { data });
}
```

### Adding New Validation
```javascript
// In validation.js
const validateSpecialInput = (req, res, next) => {
    // Validation logic
    next();
};

module.exports = {
    // ... other validations
    validateSpecialInput
};
```

This MVC structure provides a solid foundation for building scalable web applications with clear separation of concerns and maintainable code architecture.
