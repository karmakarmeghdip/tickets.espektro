# Espektro Tickets - Digital Ticketing Platform

This project is a modern, web-based ticketing platform built with [Next.js](https://nextjs.org) and [Drizzle ORM](https://orm.drizzle.team/), designed to streamline and digitalize the entire event ticketing process for college events.

## Project Overview

Espektro Tickets is a comprehensive digital ticketing solution designed specifically for educational institutions to manage events, track attendance, and handle ticket sales. The platform provides different user experiences based on the type of user (student, alumni, or visitor) and includes a powerful admin dashboard for event management.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: SQLite with Drizzle ORM
- **Authentication**: NextAuth.js
- **UI/UX**: Framer Motion, Lucide Icons

## Features

### User-Facing Features
*   **Event Discovery:** Browse upcoming events with detailed descriptions, dates, and venues
*   **User Authentication:** Secure login/signup process with role-based access
*   **User Profiles:** Specialized profiles for students, alumni, and visitors
*   **Digital Ticket Purchase:** Seamless online ticket purchasing with payment processing
*   **QR Code Generation:** Unique QR code for each ticket for secure validation
*   **Mobile-Responsive Design:** Fully accessible on all devices

### Admin Dashboard Features
*   **Overview Analytics:** Real-time statistics and metrics for events, attendees, and revenue
*   **Event Management:** Create, update, and manage events with multiple coordinators
*   **Ticket Management:** Configure ticket types, prices, and availability
*   **QR Code Scanning:** Built-in scanner for validating attendee tickets at entry points
*   **Attendance Tracking:** Monitor check-ins and attendance in real-time
*   **Transaction History:** Track all payment transactions with detailed records
*   **Role-Based Access Control:** Manage admin permissions and role assignments
*   **Discount Code Management:** Create and manage promotional codes for ticket purchases

## Database Structure

The platform uses a relational database with the following core schemas:

- **User Management:** Authentication and user profiles for different types of users (students, alumni, visitors)
- **Event Management:** Events, categories, and coordinators
- **Ticket System:** Ticket types, purchased tickets, and discount codes
- **Payment Processing:** Transactions, payment details, and refund management
- **Role System:** Role-based permissions for admin users
- **Attendance Tracking:** Check-ins, access logs, and temporary QR codes

## Project Status

This project is currently under active development. Core features of the admin dashboard and database schemas have been implemented, while user-facing features are being developed.

## Benefits

*   **Convenience:** Attendees can purchase and manage tickets from anywhere, anytime
*   **Security:** Reduces ticket fraud through unique QR codes and secure validation
*   **Efficiency:** Speeds up the check-in process and reduces administrative overhead for organizers
*   **Data Insights:** Provides organizers with valuable analytics on sales and attendance patterns
*   **Sustainability:** Eliminates the need for paper tickets, contributing to environmental conservation