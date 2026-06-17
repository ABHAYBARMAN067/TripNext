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
- **Intuitive Navigation Bar**:
  - **Logo** - Brand and home link
  - **Search Bar** - Real-time destination search
  - **Explore** - Browse all listings
  - **Bookings** *(Logged-in only)* - View your reservations
  - **Wishlist** *(Logged-in only)* - Manage your favorites
  - **Become a Host** *(Guests)* / **Dashboard** *(Hosts)* - Host management
  - **Profile** *(Logged-in only)* - User account settings
  - **Auth Buttons** - Sign In / Logout
  - **Responsive Mobile Menu** - All navigation options on mobile

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

### Guest Users

* Register or log in
* Search and explore properties
* View listing details, maps, and reviews
* Make and manage bookings
* Add listings to wishlist
* Leave reviews and ratings

### Host Users

* Create and manage property listings
* Upload listing images
* Manage guest bookings
* View host dashboard and analytics
* Track revenue and booking statistics

---

## Project Structure

```text
tripnest/
├── app/            # Next.js App Router & API Routes
├── components/     # Reusable UI components
├── lib/            # Utilities & configurations
├── models/         # MongoDB/Mongoose models
├── public/         # Static assets
├── middleware.ts   # Route protection
├── package.json
└── README.md
```

---

## Authentication & Security

* Secure authentication with NextAuth.js
* JWT-based session management
* Password hashing using bcryptjs
* Role-based access control (Guest & Host)
* Protected routes with middleware
* Email OTP verification

---

## Deployment

### Vercel

1. Push the repository to GitHub
2. Import the project into Vercel
3. Configure environment variables
4. Deploy

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---


