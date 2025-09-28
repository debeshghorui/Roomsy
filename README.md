# 🏠 Roomsy

A full-stack web application for property listings and reviews, built with Node.js, Express, MongoDB, and EJS. Users can browse accommodations, create listings, leave reviews, and manage their bookings in a secure, user-friendly environment.

## ✨ Features

### 🔐 User Authentication & Authorization

- **Secure Registration & Login** - Powered by Passport.js with local strategy
- **Password Hashing** - Secure password storage using passport-local-mongoose
- **Session Management** - Persistent login sessions with express-session
- **Role-based Access Control** - Users can only edit/delete their own listings and reviews

### 🏡 Property Management

- **Browse Listings** - View all available properties with images and details
- **Create Listings** - Property owners can add new accommodations
- **Edit/Update** - Modify listing details, images, and pricing
- **Delete Listings** - Remove properties with automatic review cleanup
- **Image Uploads** - Cloudinary integration for high-quality image storage

### ⭐ Review System

- **Star Ratings** - 1-5 star rating system with visual feedback
- **Written Reviews** - Detailed comments and experiences
- **Review Management** - Authors can edit/delete their own reviews
- **Average Ratings** - Calculated ratings displayed for each listing

### 🎨 User Experience

- **Responsive Design** - Mobile-friendly Bootstrap interface
- **Flash Messages** - Success and error notifications
- **Form Validation** - Client and server-side input validation using Joi
- **Error Handling** - Comprehensive error pages and graceful fallbacks

## 🚀 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling

### Frontend

- **EJS** - Templating engine with EJS Mate for layouts
- **Bootstrap** - CSS framework for responsive design
- **Starability.js** - Interactive star rating component

### Development Tools

- **Joi** - Schema validation
- **Method Override** - HTTP verb support
- **Connect Flash** - Flash message middleware
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Roomsy/
├── src/
│   ├── controllers/         # Business logic layer
│   │   ├── listing.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   ├── routes/             # API routes
│   │   ├── listing.routes.js
│   │   ├── review.routes.js
│   │   └── user.routes.js
│   ├── middleware/         # Custom middleware
│   │   ├── middleware.js   # Auth & authorization
│   │   └── validation.js   # Input validation
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── models/               # MongoDB schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/               # EJS templates
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── components/
├── public/              # Static assets
│   ├── css/
│   └── javascript/
└── init/               # Database initialization
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/roomsy.git
cd roomsy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Session Secret
SESSION_SECRET=your_super_secret_session_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Environment
NODE_ENV=development
```

### 4. Initialize Database (Optional)

```bash
node init/index.js
```

### 5. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Visit `http://localhost:3000` to access the application.

## 📋 API Routes

### Authentication Routes (`/auth`)

- `GET /signup` - Registration form
- `POST /signup` - Create new user
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Listing Routes (`/listings`)

- `GET /` - View all listings
- `GET /new` - New listing form (auth required)
- `POST /` - Create listing (auth required)
- `GET /:id` - View single listing
- `GET /:id/edit` - Edit form (owner only)
- `PATCH /:id` - Update listing (owner only)
- `DELETE /:id` - Delete listing (owner only)

### Review Routes (`/listings/:id/reviews`)

- `POST /` - Create review (auth required)
- `DELETE /:reviewId` - Delete review (author only)

## 🔒 Security Features

- **Input Validation** - Joi schemas prevent malicious data
- **XSS Protection** - Input sanitization and output encoding
- **Authentication** - Secure login system with session management
- **Authorization** - Resource-level access control
- **CSRF Protection** - Method override for secure form submissions
- **Secure Headers** - Production-ready security configurations

## 🎯 Future Enhancements

- [ ] **Booking System** - Calendar integration and reservation management
- [ ] **Payment Integration** - Stripe/PayPal payment processing
- [ ] **Map Integration** - Interactive maps for property locations
- [ ] **Advanced Search** - Filter by price, location, amenities
- [ ] **Messaging System** - Direct communication between users
- [ ] **Mobile App** - React Native companion app
- [ ] **Admin Dashboard** - Administrative control panel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile) -->

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image management
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Passport.js](http://passportjs.org/) - Authentication

---

⭐ **Star this repository if you found it helpful!**
