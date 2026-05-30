# 🏠 TripNest

A full-stack, Airbnb-inspired travel listing platform built with **Next.js 16**, featuring secure authentication, property listings, booking management, reviews, and interactive maps.
## Project Screenshot

![TripNest Screenshot](public/screenshot.png)



# ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)  ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)  ![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)  ![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-47A248?style=for-the-badge&logo=mongodb) 

![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-red?style=for-the-badge&logo=json-web-tokens)
![NextAuth](https://img.shields.io/badge/NextAuth.js-Authentication-blue?style=for-the-badge)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email_Service-yellow?style=for-the-badge)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)

![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Upload-3448C5?style=for-the-badge&logo=cloudinary)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Nominatim-7EBC6F?style=for-the-badge&logo=openstreetmap)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=for-the-badge&logo=axios)
![bcrypt](https://img.shields.io/badge/bcrypt-Password_Hashing-lightgrey?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?style=for-the-badge&logo=docker)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=github-actions)

# Tech Stack

### Frontend
- **Next.js 16** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS 4** - Utility-first CSS framework
- **Redux Toolkit** - Global state management
- **Lucide React** - Icon library

### Backend
- **Node.js 20** - JavaScript runtime
- **Next.js API Routes** - Serverless API endpoints

### Database
- **MongoDB 4.4+** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **NextAuth.js** - Authentication library
- **JWT** - JSON Web Tokens for session management
- **bcryptjs** - Password hashing

### External Services & Libraries
- **Cloudinary** - Image upload and management
- **Nodemailer** - Email service
- **Leaflet** - Interactive maps
- **React Leaflet** - React components for Leaflet
- **OpenStreetMap Nominatim** - Geocoding and location search
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **GitHub Actions** - CI/CD automation
- **Vercel** - Deployment platform

### Development Tools
- **Biome** - Linter and formatter
- **TypeScript** - Type checking
- **PostCSS** - CSS processing


# TypeScript Migration

This project has been **fully migrated** from JavaScript to **TypeScript**:

- All components converted from `.jsx` to `.tsx`
- All API routes converted from `.js` to `.ts`
- All configuration files converted to TypeScript
- Full type safety with strict TypeScript configuration
- Mongoose models with proper TypeScript interfaces
- Next.js App Router with typed API routes
- Type-safe authentication and session management

Run `npm run typecheck` to validate types.

---

# External Services
- **Cloudinary** – Image hosting & optimization
- **Nominatim (OpenStreetMap)** – Geocoding
- **Leaflet** – Interactive maps


### Deployment
- **Vercel** - Hosting platform


## Features

###  Authentication & Session Management
- Secure authentication using **NextAuth.js**
- JWT-based session handling
- MongoDB-backed persistent sessions
- Real-time UI updates on login/logout
- Role-based session data
- HTTP-only cookies for enhanced security
- Email verification with OTP (6-digit code)
- Welcome email after successful registration

###  User Management
- Dual roles: **Guest** and **Host**
- Secure login & registration
- Email OTP verification for account activation
- Welcome email after successful verification
- Role-based protected routes
- User profiles with bio and avatar upload
- Personalization: wishlist, saved searches, recently viewed

###  Property Listings
- Full CRUD operations
- Multiple image uploads via Cloudinary
- Image gallery with thumbnail navigation
- Detailed listing information (pricing, amenities, location)
- Interactive maps with Leaflet & Nominatim
- Advanced filtering (price, amenities, ratings)
- Real-time search with debounced input
- Location-based search using geospatial queries
- Hero section with platform statistics

###  Booking System
- Calendar-based date selection
- Flexible guest count handling with validation
- Booking conflict detection (prevents double bookings)
- Date availability checking
- Booking status tracking (pending, confirmed, cancelled)
- Automatic pricing calculation based on nights

###  Review System
- 1–5 star rating system
- Authenticated user reviews
- Review creation & deletion
- Average rating and review count display

###  User Personalization
- Wishlist / favorites
- Saved search filters
- Recently viewed listings
- Profile editing with image upload

###  User Interface
- Mobile-first responsive design
- Modern, clean UI with TailwindCSS
- Interactive components (modals, forms, galleries)
- Toast notifications for user feedback

## Getting Started

### Prerequisites
- **Node.js** 18.17 or later
- **MongoDB** 4.4 or later (local or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ABHAYBARMAN067/TripNest.git
   cd tripnest
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database (either variable name is supported)
   MONGODB_URI=mongodb://localhost:27017/tripnest
   # or
   # MONGO_URI=mongodb://localhost:27017/tripnest

   # JWT Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # NextAuth.js Session Management
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary Image Upload
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Email Configuration (NodeMailer)
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=TripNest

   # Development
   NODE_ENV=development
   PORT=3000
   ```

   **Email Setup**: For Gmail, generate an app password in your Google Account settings (Security → 2-Step Verification → App passwords).

4. **Start MongoDB**
   Make sure MongoDB is running locally or update `MONGODB_URI` for cloud database.

5. **(Optional) Run type-checks**
   ```bash
   npm run typecheck
   # or
   yarn typecheck
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- **Development**
  ```bash
  npm run dev
  ```
- **Production build**
  ```bash
  npm run build
  ```
- **Start production server (after build)**
  ```bash
  npm start
  ```
- **Lint & format (using Biome)**
  ```bash
  npm run lint
  npm run format
  ```
- **Type checking**
  ```bash
  npm run typecheck
  ```

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Lint & format code
- `npm run format` - Format code
- `npm run typecheck` - TypeScript validation

## Usage

### For Guests
1. Register/Login as guest
2. Browse & filter listings
3. View property details with maps/reviews
4. Make bookings with calendar
5. Leave reviews, manage bookings

### For Hosts
1. Register/Login as host
2. Create/manage listings with photos
3. Confirm/cancel guest bookings
4. View dashboard analytics (total listings, bookings, revenue, average rating)
5. Manage booking status (pending, confirmed, cancelled)
6. View recent bookings and statistics

## Project Structure

```
tripnest/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages (login/register)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts      # NextAuth.js configuration
│   │   │   ├── login/
│   │   │   │   └── route.ts      # User login API
│   │   │   ├── logout/
│   │   │   │   └── route.ts      # User logout API
│   │   │   ├── register/
│   │   │   │   └── route.ts      # User registration API
│   │   │   ├── status/
│   │   │   │   └── route.ts      # Authentication status API
│   │   │   └── verify-otp/
│   │   │       └── route.ts      # OTP verification API
│   │   ├── bookings/             # Booking management APIs
│   │   │   ├── route.ts          # Booking list API
│   │   │   └── [id]/
│   │   │       └── route.ts      # Individual booking operations
│   │   ├── geocode/
│   │   │   └── route.ts          # Address geocoding API
│   │   ├── host/                 # Host-specific APIs
│   │   │   ├── bookings/
│   │   │   │   └── route.ts      # Host booking management
│   │   │   ├── listings/
│   │   │   │   └── route.ts      # Host listing management
│   │   │   └── stats/
│   │   │       └── route.ts      # Host dashboard statistics
│   │   ├── listings/             # Property listing APIs
│   │   │   ├── route.ts          # Listing list API
│   │   │   └── [id]/
│   │   │       └── route.ts      # Individual listing operations
│   │   ├── reviews/              # Review system APIs
│   │   │   ├── route.ts          # Review list API
│   │   │   └── [id]/
│   │   │       └── route.ts      # Individual review operations
│   │   ├── upload/
│   │   │   └── route.ts          # Image upload API
│   │   └── user/                 # User-specific APIs
│   │       ├── profile/
│   │       │   └── route.ts      # User profile management
│   │       ├── recently-viewed/
│   │       │   └── route.ts      # Recently viewed listings
│   │       └── saved-searches/   # Saved search filters
│   │           └── [id]/
│   │               └── route.ts   # Individual saved search operations
│   ├── bookings/
│   │   └── page.tsx              # Guest booking pages
│   ├── host/                     # Host dashboard pages
│   │   ├── bookings/
│   │   │   └── page.tsx          # Host booking confirmations
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Host dashboard with stats
│   │   └── listings/             # Host listing management
│   │       ├── [id]/
│   │       │   ├── edit/
│   │       │   │   └── page.jsx  # Edit listing page
│   │       │   └── page.jsx      # Individual listing pages
│   │       ├── new/
│   │       │   └── page.tsx      # Create new listing page
│   │       └── page.tsx          # Host listings overview
│   ├── listings/                 # Public listing pages (redirects to home)
│   │   └── page.tsx              # Redirect to home page
│   ├── globals.css               # Global CSS styles
│   ├── layout.tsx                # Root layout with providers
│   ├── not-found.tsx             # 404 error page
│   └── page.tsx                  # Home page (listing grid)
├── components/                   # Reusable React components
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx         # Login form component
│   │   └── RegisterForm.tsx      # Registration form component
│   ├── bookings/                 # Booking-related components
│   │   ├── BookingForm.tsx       # Booking creation form
│   │   └── BookingList.tsx       # Booking list display
│   ├── host/                     # Host-specific components
│   │   ├── HostDashboard.tsx     # Host dashboard component
│   │   └── HostListings.tsx      # Host listings management
│   ├── listings/                 # Listing display components
│   │   ├── ListingCard.tsx       # Individual listing card
│   │   ├── ListingDetail.tsx     # Detailed listing view
│   │   ├── ListingGrid.tsx       # Grid layout for listings
│   │   └── ListingsPageClient.tsx # Client component for listings page
│   ├── maps/                     # Interactive map components
│   │   ├── Map.jsx               # Leaflet map component
│   │   └── Map.tsx               # TypeScript version of map component
│   ├── reviews/                  # Review system components
│   │   ├── ReviewCard.tsx        # Individual review display
│   │   └── ReviewList.tsx        # List of reviews
│   ├── ui/                       # UI primitive components
│   │   ├── Button.tsx            # Reusable button component
│   │   ├── Input.tsx             # Form input component
│   │   ├── Modal.tsx             # Modal dialog component
│   │   └── NavBar.tsx            # Navigation bar component
│   └── SessionProviderWrapper.tsx # NextAuth session provider wrapper
├── lib/                          # Utility functions & configurations
│   ├── auth.ts                   # JWT token helpers & authentication
│   ├── auth-config.ts            # NextAuth.js configuration
│   ├── db.ts                     # MongoDB connection & caching
│   ├── email.ts                  # Email service with OTP functionality
│   ├── mongodb.ts                # MongoDB client promise for NextAuth
│   └── roles.ts                  # Role-based access helpers
├── models/                       # MongoDB/Mongoose schemas
│   ├── Booking.ts                # Booking reservation model
│   ├── Listing.ts                # Property listing model
│   ├── Review.ts                 # Review & rating model
│   └── User.ts                   # User model with authentication
├── public/                       # Static assets
├── colorUse.md                   # Color usage documentation
├── tsconfig.json                 # TypeScript configuration
├── next-env.d.ts                 # Next.js TypeScript environment declarations
├── middleware.ts                 # Route protection & role validation
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.cjs            # PostCSS configuration
├── README.md                     # This file
└── .gitignore                    # Git ignore rules
```
## API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication routes (login, logout, session)
- `POST /api/auth/login` - Custom user login API
- `POST /api/auth/logout` - Custom user logout API
- `GET /api/auth/status` - Authentication status check
- `POST /api/auth/register` - Send OTP for user registration
- `POST /api/auth/verify-otp` - Verify OTP and complete registration

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile (name, bio, photo)
- `DELETE /api/user/saved-searches/[id]` - Delete a saved search
- `GET /api/user/wishlist` - Get user's favorite listings
- `POST /api/user/wishlist` - Add listing to wishlist
- `DELETE /api/user/wishlist/[id]` - Remove listing from wishlist
- `GET /api/user/recently-viewed` - Get recently viewed listings
- `POST /api/user/recently-viewed` - Track a viewed listing

### Listings
- `GET /api/listings` - Get all listings (with advanced filters: location, price, amenities, ratings)
- `POST /api/listings` - Create new listing (host only)
- `GET /api/listings/[id]` - Get single listing
- `PUT /api/listings/[id]` - Update listing (host only)
- `DELETE /api/listings/[id]` - Delete listing (host only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings/[id]` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/[id]` - Delete review

### Host Endpoints
- `GET /api/host/stats` - Host dashboard statistics
- `GET /api/host/listings` - Host's listings
- `GET /api/host/bookings` - Host's bookings

### Utilities
- `POST /api/upload` - Image upload to Cloudinary
- `GET /api/geocode` - Address geocoding


## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'guest' | 'host',
  emailVerified: Boolean,
  createdAt: Date
}
```

### Listing
```javascript
{
  title: String,
  description: String,
  price: Number,
  maxGuests: Number,
  location: { address: String, coordinates: [lng, lat] },
  images: [{ url: String, publicId: String }],
  amenities: [String],
  host: ObjectId,
  isActive: Boolean,
  createdAt: Date
}
```

### Booking
```javascript
{
  listing: ObjectId,
  guest: ObjectId,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'cancelled',
  createdAt: Date
}
```

### Review
```javascript
{
  listing: ObjectId,
  user: ObjectId,
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

## Authentication & Security

- **JWT Tokens**: Stored securely in HTTP-only cookies
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Guest and Host permissions
- **Route Protection**: Middleware validates authentication and roles
- **Input Validation**: Client and server-side validation

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect Vercel to repo
3. Add production env vars
4. Deploy

### Other Platforms
- Railway, Render, AWS, Heroku with similar setup

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes, test thoroughly
4. Submit pull request

## License

**Proprietary Software** © 2025  ( https://github.com/ABHAYBARMAN067/TripNest-With-TypeScript )  All rights reserved.

**Happy coding! ** Built with Next.js, MongoDB, and modern web technologies.
