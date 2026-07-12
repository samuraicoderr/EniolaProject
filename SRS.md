# Software Requirements Specification (SRS)

## 1. Document Information

- Project Name: EniolaProject
- Document Version: 1.0
- Date: 2026-07-12
- Author: AI Assistant
- Purpose: Define the functional and non-functional requirements for the EniolaProject learning platform.

## 2. Product Overview

EniolaProject is a multi-platform educational application designed to help learners engage with Yoruba language content through interactive lessons, video-based learning, progress tracking, gamified experiences, and administrative management tools. The system consists of a Django REST backend, a Next.js frontend, and mobile-ready Capacitor-based applications.

## 3. Product Scope

### 3.1 In Scope
- User authentication and account management
- Learning content delivery for Yoruba language topics
- Video lesson access
- Progress and leaderboard tracking
- AI-assisted or coach-style interaction experience
- Admin dashboard for oversight and configuration
- API documentation and health monitoring

### 3.2 Out of Scope
- Third-party payment processing beyond existing backend integrations
- Full enterprise-scale analytics or reporting beyond the current admin features
- Cross-platform marketplace distribution

## 4. Stakeholders

- Learners and students
- Coaches and instructors
- Administrators
- Product owners / project maintainers
- Developers maintaining the frontend and backend

## 5. Functional Requirements

### 5.1 User Management
The system shall allow users to:
- Register and authenticate into the platform
- Log in and refresh authentication tokens
- Reset passwords securely
- Access account information and role-based profile data

### 5.2 Learning Experience
The system shall provide:
- Access to educational content organized by topic or learning module
- Video-based learning pages
- Interactive learning progression for users
- A gamified experience including progress and ranking indicators

### 5.3 Coach / Assistant Experience
The system shall support:
- A conversational coach-style interface for guided learning support
- Response handling for learner queries in a structured interactive experience

### 5.4 Progress and Engagement
The system shall allow users to:
- View personal learning progress
- View ranking and leaderboard information
- Track their achievements or engagement milestones

### 5.5 Administration
The system shall provide admin users with:
- Access to an admin dashboard
- Visibility into platform management features
- Role-based access controls for privileged actions

### 5.6 API and Integration Requirements
The system shall provide:
- REST API endpoints for frontend and mobile consumption
- API schema documentation via Swagger/ReDoc
- Health-check endpoints for service monitoring

## 6. Non-Functional Requirements

### 6.1 Usability
- The user interface shall be intuitive and accessible for learners of varying technical experience.
- The experience shall be visually consistent across web and mobile-inspired interfaces.

### 6.2 Performance
- The web application shall load content efficiently for typical user traffic.
- API responses shall be optimized for responsive user interactions.

### 6.3 Security
- Authentication shall use secure token-based mechanisms.
- Sensitive user data shall be protected through standard backend security practices.
- Password reset flows shall be implemented securely.

### 6.4 Reliability
- The backend shall provide health checks to support operational monitoring.
- The application shall handle common API and network failures gracefully.

### 6.5 Maintainability
- The system shall be structured using modular backend and frontend components.
- Code should be documented and organized to support future enhancement.

## 7. System Architecture Overview

### 7.1 Frontend
- Built with Next.js
- Supports responsive web interfaces and mobile-ready deployment via Capacitor
- Uses shared UI components and route-based pages

### 7.2 Backend
- Built with Django and Django REST Framework
- Exposes RESTful API endpoints
- Supports authentication, user management, and content-related services

### 7.3 Data and Integration
- Uses SQLite in the local development environment
- Supports extensible integrations for notifications, media, and external services

## 8. User Stories

- As a learner, I want to access Yoruba learning content so that I can study in a structured way.
- As a learner, I want to track my progress so that I can see my improvement over time.
- As a learner, I want to view leaderboards so that I can compare my engagement with others.
- As an admin, I want to manage the platform from a dashboard so that I can oversee operations.
- As a developer, I want documented APIs so that I can integrate and extend the system easily.

## 9. Assumptions and Dependencies

- The project uses Django for backend services and Next.js for the frontend.
- The application will continue to evolve with additional content and features.
- External services such as notifications or media integrations may be added over time.

## 10. Acceptance Criteria

The project shall be considered complete for the current scope when:
- Users can register, authenticate, and access protected areas of the app.
- Learning content, video pages, progress, and ranking views are available.
- Admin dashboard access is present for authorized users.
- The API is reachable and documented.
- The system can be run locally in development mode using the provided project tooling.

## 11. Open Issues / Future Enhancements

- Expand content coverage and curriculum depth
- Improve analytics and reporting for admins
- Add richer personalization and adaptive learning features
- Extend mobile experience and offline support
