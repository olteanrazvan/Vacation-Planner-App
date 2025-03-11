# 🌍 GlobeBound - Vacation Planning Platform

## 📌 About GlobeBound

GlobeBound is an innovative vacation planning application that allows users to search for, book, and review accommodations in various destinations. The platform facilitates direct interaction between accommodation owners and travelers, providing a transparent and efficient booking experience. Inspired by platforms like Airbnb and Booking.com, GlobeBound offers features such as property listings, user reviews, and an advanced search system.

## 🚀 Features

### 🔑 Authentication & User Roles

- Secure login and registration with email and password.
- Role-based access control: **User, Property Owner, Moderator, Administrator**.
- Password recovery functionality.

### 🏠 Accommodation Search & Booking

- Search accommodations by **location, price, type, and availability**.
- Filter results based on user ratings, amenities, and other preferences.
- View detailed accommodation listings with images, descriptions, and pricing.
- Make bookings with a clear summary (dates, price, location).

### 🏡 Property Management for Owners

- List, edit, and remove accommodations.
- Manage pricing, availability, and details.
- Respond to user reviews and ratings.

### ⭐ Reviews & Ratings

- Users can leave reviews and ratings after completing a stay.
- Property owners can respond to reviews.
- Moderators ensure reviews comply with platform policies.

### 🔔 Notifications & Admin Dashboard

- Email notifications for **booking confirmations, cancellations, and updates**.
- **Admin panel** for managing users, accommodations, and reported issues.

## 🛠️ Tech Stack

### **Backend**

- **Java Spring Boot** - Scalable and efficient backend development.
- **MySQL** - Database for storing users, accommodations, bookings, and reviews.
- **RESTful API** - Enables seamless interaction between frontend and backend.

### **Frontend**

- **React.js** - Dynamic and interactive user interface.
- **Bootstrap** - For a responsive and user-friendly design.

### **Development & Deployment**

- **IntelliJ IDEA & MySQL Workbench** - Development tools.
- **Git & GitHub** - Version control and collaboration.
- **Google Maps API** - For displaying accommodation locations.

## 🔄 System Architecture

- **Client-Server Model** - A React.js frontend communicates with a Java Spring Boot backend via RESTful API.
- **Database Schema** - MySQL tables store user accounts, accommodations, reservations, and reviews.
- **Role-Based Access Control** - Different user roles have specific permissions for managing content and actions.

## ⚙️ How It Works

1. **User Registration & Login** 🔑

   - Users sign up and log in to access platform features.
   - JWT authentication ensures session security.

2. **Searching & Filtering Accommodations** 🔍

   - Users search using filters (location, price, type, rating, amenities).
   - Results are displayed dynamically, showing key property details.

3. **Booking Process** 🏠

   - Users select accommodation, choose dates, and confirm booking.
   - System updates availability and notifies the property owner.

4. **Leaving Reviews & Ratings** ⭐

   - After staying at a property, users can leave a review.
   - Moderators ensure compliance with community guidelines.

5. **Managing Listings (For Property Owners)** 🏡

   - Owners can add, edit, and remove their accommodations.
   - View booking details and respond to user reviews.

6. **Admin & Moderation** ⚖️

   - Administrators manage users and platform settings.
   - Moderators review and filter inappropriate content.

## 🏗️ Future Enhancements

- **Payment Integration** 💳 (Stripe/PayPal for secure payments)
- **Real-Time Chat** 💬 (Direct communication between users and owners)
- **AI-based Recommendation System** 🤖 (Suggesting accommodations based on user preferences)
