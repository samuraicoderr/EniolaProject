# Methodology and Technical Architecture

## 1. Purpose

This document describes the technical methodology, architecture, infrastructure, and development approach used by the EniolaProject codebase. It is based on the current repository structure, configuration files, and implementation patterns present in the project.

## 2. Project Overview

EniolaProject is a full-stack educational platform focused on Yoruba language learning. The repository is organized into two primary application domains:

- Backend: Django-based REST API and asynchronous services
- Frontend: Next.js application with mobile wrapper support via Capacitor

The system is designed to support:

- User authentication and account management
- Learning content delivery
- Video and interactive lesson experiences
- Progress and ranking features
- Admin oversight and management screens
- API documentation and monitoring endpoints

## 3. System Architecture

### 3.1 High-Level Architecture

The application follows a classic client-server architecture:

- The frontend communicates with the backend through HTTP/REST APIs
- The backend exposes business logic, authentication, and persistence services
- Static assets and media are served through configured web and storage layers
- Optional asynchronous processing is supported through Celery/Redis infrastructure

### 3.2 Runtime Composition

The current architecture can be summarized as:

- Frontend layer: Next.js application rendered as a web app and exported for mobile packaging
- API layer: Django + Django REST Framework
- Web server layer: Nginx for reverse proxy / static serving patterns
- Application server layer: Gunicorn or Daphne for WSGI/ASGI execution
- Background task layer: Celery + Redis/beat scheduler
- Data layer: SQLite by default for local development, with configurable PostgreSQL/MySQL support

## 4. Technology Stack

### 4.1 Backend

Core backend technologies:

- Python 3.12–3.14
- Django 4.2.x
- Django REST Framework
- Channels for WebSocket/asynchronous support
- Celery for background tasks
- Redis for celery broker/channel layer support
- DRF Spectacular for OpenAPI/Swagger generation
- Gunicorn and Daphne as application servers

### 4.2 Frontend

Core frontend technologies:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Capacitor for Android/iOS packaging
- Framer Motion / Motion for UI animation
- Zustand for state management
- TanStack React Query for data fetching

### 4.3 Infrastructure and DevOps

Repository-level infrastructure support includes:

- Dockerfiles for backend and nginx containerization
- Makefiles for local setup, migration, and task execution
- Environment-driven configuration for development and deployment
- Static export support for frontend builds
- Mobile build commands for Android/iOS packaging

## 5. Backend Architecture

### 5.1 Application Structure

The backend follows a modular Django application structure under the src package. Key modules include:

- src.users: authentication, user profiles, roles, and account-related logic
- src.common: shared utilities and common abstractions
- src.files: file and media management
- src.notifications: messaging and notification workflows
- src.yoruba_learning: learning content and interaction logic

This modular organization supports separation of concerns and future expansion.

### 5.2 Request Handling

Incoming requests are routed through Django URL configuration and DRF routers. The project uses:

- Standard Django URL patterns
- DRF router-based endpoints
- Schema generation endpoints for Swagger and Redoc
- Health-check endpoints for monitoring

### 5.3 Configuration Strategy

The backend uses environment-driven settings loaded through Django settings modules. This design allows:

- Different behavior in development and production
- Secure secrets to be injected through environment variables
- Alternative databases and cache configurations when required

Notable configuration patterns include:

- Debug mode controlled through environment variables
- Allowed hosts and CSRF origins configured per environment
- CORS and security headers configured for production safety
- Redis availability handled dynamically with fallback behavior

### 5.4 Data Layer

The default local configuration uses SQLite for simplicity. The codebase also supports alternate backends such as PostgreSQL and MySQL through environment-based settings. The data layer is therefore designed to be flexible while keeping local development lightweight.

### 5.5 Asynchronous and Background Processing

The repository includes support for asynchronous work through:

- Celery workers
- Celery beat scheduler
- Redis-backed broker and result backend configuration

This makes the system capable of handling background jobs such as notifications, scheduled processing, and future automation tasks.

## 6. Frontend Architecture

### 6.1 Application Model

The frontend is built as a modern Next.js application using the App Router. The structure is organized around route-based pages and reusable UI building blocks.

### 6.2 Rendering Model

The project is configured to export static output using Next.js. This supports deployment flexibility and mobile packaging. The build output is optimized for static hosting or hybrid app deployment.

### 6.3 UI Architecture

The frontend uses a component-driven structure with:

- Shared UI elements in reusable components folders
- Route-specific app pages in the app directory
- Utility modules for API integrations and common helpers
- Tailwind-based styling with design-system-like consistency

### 6.4 Mobile Strategy

The project includes Capacitor configuration for building mobile applications. The current setup targets Android and iOS packaging through generated native projects and build commands.

## 7. Infrastructure and Deployment Model

### 7.1 Local Development

Local development is supported through:

- Backend Makefile commands for Django management tasks
- Frontend Makefile commands for install, build, and run operations
- Dockerized backend and nginx components for container-based deployment

Typical development flow:

1. Install Python dependencies with uv
2. Install frontend dependencies with npm
3. Run the Django backend locally or via Docker
4. Run the Next.js frontend locally
5. Use migrations and management commands for database updates

### 7.2 Containerization

The repository includes:

- A backend Dockerfile that installs Python dependencies, copies the app, and starts Gunicorn
- An nginx Docker image for serving and proxying application traffic

This container approach supports a more production-like environment and makes deployment easier across different hosts.

### 7.3 Production Readiness

The current configuration suggests a production-oriented deployment model with:

- Environment variables for secrets and host configuration
- HTTPS enforcement in production settings
- Security headers and CORS controls
- Nginx-based request handling and compression
- Static asset collection for Django

## 8. Security Approach

The project incorporates several security measures:

- Secret key enforcement in production
- Environment-based configuration for sensitive values
- CORS and CSRF configuration
- HTTPS redirection and secure cookie settings in production mode
- Security headers configured in nginx
- Password reset and authentication mechanisms in the backend

## 9. Observability and Operations

The codebase includes support for operational monitoring through:

- Health-check endpoints
- Logging configuration modules
- Sentry integration for error monitoring
- Redis and Celery status-aware configuration

These capabilities support debugging and production monitoring, even though detailed deployment dashboards and alerting are not fully described in the repository.

## 10. Development Methodology

The project appears to follow a modular, iterative development methodology:

- Backend and frontend are developed as separate but integrated systems
- Shared requirements are captured in docs such as the SRS and planning notes
- Feature work is organized around modules and routes rather than a monolithic codebase
- The repository includes automation through Makefiles and scripts for repetitive tasks

## 11. Strengths of the Current Architecture

- Clear separation between frontend and backend concerns
- Modular Django app structure
- Flexible environment-driven configuration
- Support for async/background processing
- Mobile packaging support through Capacitor
- Good foundation for future scaling and API expansion

## 12. Risks and Considerations

Potential concerns to monitor as the project evolves:

- The backend currently defaults to SQLite for local development, which may need adjustment for production-scale deployment
- Environment configuration must be managed carefully to avoid insecure deployments
- Background services and Redis should be provisioned consistently in production
- Static export and mobile packaging require careful build validation

## 13. Recommended Technical Direction

To strengthen the system over time, the following would be beneficial:

- Standardize deployment with Docker Compose or a cloud-native deployment pipeline
- Introduce automated tests for backend and frontend modules
- Add CI/CD workflows for build and validation
- Expand monitoring and logging dashboards
- Document API versioning and service contracts more explicitly
